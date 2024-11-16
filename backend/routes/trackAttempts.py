import boto3.exceptions
from flask import Blueprint, jsonify, request
import music21
from dataclasses import dataclass
from typing import List, Union
import tempfile
import librosa
import numpy as np
import wave as wave
import ffmpeg

import boto3
from botocore.client import ClientError
# import io
import os
from .auth import token_required
from dotenv import load_dotenv
from groq import Groq

import Levenshtein as lev

from dynamodb_helpers import updateAchievements, getTrackAttempyDetails, getSongDetails, getUserDetails

load_dotenv()
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

trackAttempts_bp = Blueprint('trackAttempts', __name__)

@dataclass
class MusicalElement:
    element_type: str           # 'Note' or 'Chord'
    names: List[str]            # List of note names for chords or a single note name for notes
    frequencies: List[float]    # List of frequencies for chords or a single frequency for notes
    timestamp: float            # Timestamp in seconds
    duration: float             # Duration in seconds
    bar_number: int             # Measure number

def extract_notes_and_chords(part, seconds_per_quarter):
    '''
    Helper funtion that iterates through every bar in a specific "part" of the xml file
    Input - {
        part- The part from the xml file you want to sort through
        seconds_per_quarter- float (How many seconds a quarter is in the track)
    }
    Returns - {
        elements - [MusicalElement] (List of all musical elements within that staff)
    }
    '''
    elements = []
    for bar in part.getElementsByClass(music21.stream.Measure):
        bar_start_time = bar.offset * seconds_per_quarter

        for note in bar.notes:
            timestamp_seconds = bar_start_time + (note.offset * seconds_per_quarter)
            duration = note.duration.quarterLength * seconds_per_quarter
            bar_number = bar.number

            if isinstance(note, music21.note.Note):
                note_name = note.nameWithOctave
                freq = note.pitch.frequency
                elements.append(MusicalElement(
                    element_type='Note',
                    names=[note_name],
                    frequencies=[freq],
                    timestamp=timestamp_seconds,
                    duration=duration,
                    bar_number=bar_number
                ))
            elif isinstance(note, music21.chord.Chord):
                note_names = [p.nameWithOctave for p in note.pitches]
                freqs = [p.frequency for p in note.pitches]
                elements.append(MusicalElement(
                    element_type='Chord',
                    names=note_names,
                    frequencies=freqs,
                    timestamp=timestamp_seconds,
                    duration=duration,
                    bar_number=bar_number
                ))

    return elements


def processXML(file):
    '''
    Helper funtion that scrapes the data for a track through an xml file
    Input - {
        file- xml file you want to get data from
    }
    Returns - {
        left_hand_elements - list[MusicalElement] (All the different notes that are present within the staff for left hand)
        right_hand_elements - list[MusicalElement] (All the different notes that are present within the staff for right hand)
        dynamics - list[(dynamic, timestamp)] (The dynamics present throughout the track aswell as when they occur )
    }
    '''
    score = music21.converter.parse(file, format='musicxml')

    # Get BPM and calculate seconds per quarter
    tempo_markings = score.flatten().getElementsByClass(music21.tempo.MetronomeMark)
    bpm = tempo_markings[0].number if tempo_markings[0].number else 120
    seconds_per_quarter = 60 / bpm

    # Process left-hand and right-hand notes
    right_hand_elements = extract_notes_and_chords(score.parts[0], seconds_per_quarter)
    left_hand_elements = []
    if len(score.parts) == 2:
        left_hand_elements = extract_notes_and_chords(score.parts[1], seconds_per_quarter)

    # Iterate through dynamics
    dynamics = []
    for element in score.flatten().getElementsByClass(music21.dynamics.Dynamic):
        timestamp_seconds = element.offset * (60 / bpm)
        dynamics.append((element.value, timestamp_seconds))

    return left_hand_elements, right_hand_elements, dynamics, bpm

# EVERYTHING BELOW IS FOR PARSING RAW AUDIO
s3_client = boto3.client(
    service_name='s3',
    region_name='ap-southeast-2',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key
)

def checkAndConvertWebmToWav(userAudioKey: str) -> str:
    '''
    For an uploaded user's audio, we don't know if the format is webm or wav
    To ensure that we can load it into librosa correctly:
        - check if it is a .wav file
            - if it is then return the file path immediately
        - if it isn't, it's a .webm and we need to convert it first
    '''

    getUserAudioSubmission = None
    try:
        getUserAudioSubmission = s3_client.get_object(Bucket=os.getenv('S3_BUCKET_USER_AUDIO'), Key=userAudioKey)
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            try:
                getUserAudioSubmission = s3_client.get_object(Bucket=os.getenv('S3_BUCKET_USER_VIDEO'), Key=userAudioKey)
            except ClientError as e:
                raise e

    userAudio = getUserAudioSubmission['Body'].read()

    with tempfile.NamedTemporaryFile(delete=False) as tempUserAudioUnknownType:
        tempUserAudioUnknownTypePath = tempUserAudioUnknownType.name
        tempUserAudioUnknownType.write(userAudio)
        # storing the userAudio in tempUserAudioUnknownTypePath
        # we still don't know if this file is a webm or a wav file yet.
    tempFinalUserAudioPath = tempUserAudioUnknownTypePath

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tempUserAudioAsWav:
        tempUserAudioAsWavPath = tempUserAudioAsWav.name

    try:
        # Checking if it is a .wav file, if it is then continue like normal
        with wave.open(tempUserAudioUnknownTypePath, 'rb') as wv:
            print('.wav file detected, processing in librosa...')
    except wave.Error as e:
        # Then it must be a webm file, so we write the converted to a new file and set the finalAudioPath to the new one
        print(str(e) + ', converting .webm to .wav')
        ffmpeg.input(tempUserAudioUnknownTypePath).output(tempUserAudioAsWavPath, format='wav').run(quiet=True, overwrite_output=True)
        tempFinalUserAudioPath = tempUserAudioAsWavPath
        print(f"File conversion successful, cleaning up temporary files.")
        os.remove(tempUserAudioUnknownTypePath)

    return tempFinalUserAudioPath


def processUserAudioRaw(file) -> list:
    '''
    Taking the user's uploaded audio, we convert it to an array of notes
    with relevant info for comparing to the data scraped by the xml for that song
    '''
    audio, sr = librosa.load(file)
    stft = np.abs(librosa.stft(audio))
    frequencies = librosa.fft_frequencies(sr=sr)
    times = librosa.times_like(stft, sr=sr)

    res = []
    # additional keywords might help:, delta=0.06, hop_length=512
    onset_frames = librosa.onset.onset_detect(y=audio, sr=sr)
    for onset in onset_frames:
        time = librosa.frames_to_time(onset, sr=sr)
        # Slice the STFT for a short window around the onset
        frame_slice = stft[:, onset:onset + 5]
        amplitude = np.mean(librosa.amplitude_to_db(frame_slice))
        freq_index = np.argmax(np.mean(frame_slice, axis=1))
        freq = frequencies[freq_index]
        note = librosa.hz_to_note(freq)

        res.append((note, float(round(freq, 2)), float(round(time, 2)), int(amplitude)))

    return res

def generateMetricsForSubmission(trackAttemptId, songId):
    '''
    returns (pitchPercent, intonationPercent, rhythmPercent, dynamicPercent)

    Note: RhythmPercent can be > or < 1
    * greater than 1 = late
    * less than 1 = early
    '''

    # Since uploaded user audio can either be .webm or .wav
    # we generate a new temp file which is the converted .wav if necessary
    userAudioFilePath = checkAndConvertWebmToWav(trackAttemptId)

    # A bit cursed but windows gives us permission errors if we try to open the file directly
    # instead we write to a temporary file and leave it open to process the .mxl file
    # afterwards we have to do the cleanup. This only applies to music21.converter. Librosa is happy
    # to parse the file in raw bytes.
    getTrackAudioRes = s3_client.get_object(Bucket=os.getenv('S3_BUCKET_TRACK_SHEET'), Key=songId)
    trackAudio = getTrackAudioRes['Body'].read()

    pitchPercent, intonationPercent, rhythmPercent = 0, 0, 0

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mxl") as tempFile:
        tempFile.write(trackAudio)
        tempFilePath = tempFile.name
    try:
        data = processXML(tempFilePath)
        melodyNotes: list[MusicalElement] = data[1]
        dynamics = data[2]
        songBPM = data[3]
        userAttemptData = processUserAudioRaw(userAudioFilePath)
        # first we need to normalise the timestamps before calculating metrics
        # take the first note's time and compare with the correct timestamp
        timeCalibrationDelta = melodyNotes[0].timestamp - userAttemptData[0][2]
        # if -ve, then we are late and we need to add delta to all elements
        # if +ve, then we are early and we need to add delta to all elements
        def amendTiming(element):
            return (element[0], element[1], round(element[2] + timeCalibrationDelta, 2), element[3])
        userAttemptData = list(map(amendTiming, userAttemptData))

        '''
        Pitch: % of correct notes (levenshtein distance)
        Intonation: % n - no. of notes where the abs(deltaFreq) < 5Hz
        Rhythm, % of notes which are on time, % of notes with the correct duration
        Dynamics: % fake this one
        '''
        allNotesPlayed = list(map(lambda e: e[0], userAttemptData))
        allCorrectNotes = list(map(lambda m: m.names[0], melodyNotes))
        pitchPercent = round(1 - lev.distance(allCorrectNotes, allNotesPlayed) / len(allNotesPlayed), 5)

        # all the notes that appear in a song
        noteGlossary = {}
        for note in melodyNotes:
            if note.names[0] in melodyNotes:
                continue
            else:
                noteGlossary[note.names[0]] = note.frequencies[0]

        ALLOWABLE_INTONATION_DELTA = 6.5
        # each semitone differs by ~60hz, so we allow ~10% error before a intonation is a problem
        badIntonationCounter = 0
        for note in userAttemptData:
            noteName, freq = note[0], note[1]
            if noteName in noteGlossary:
                if abs(freq - noteGlossary[noteName]) >= ALLOWABLE_INTONATION_DELTA:
                    badIntonationCounter += 1
        intonationPercent = round(1 - badIntonationCounter / len(allNotesPlayed), 5)

        # for both lists
        # For each note, find the difference between that and the next note
        # sum the value for each element
        def createHopMap(times: list) -> list:
            res = [times[0]]
            for i, t in enumerate(times[1:]):
                res.append(times[i] - times[i - 1])

            return res
        correctHopMap = createHopMap(list(map(lambda m: m.timestamp, melodyNotes)))
        userHopMap = createHopMap(list(map(lambda e: e[2], userAttemptData)))
        # Skipping the first couple notes because there's too much rhythmic inconsistency
        # from when users start recording audio
        rhythmPercent = 1 - (sum(correctHopMap[4:]) - sum(userHopMap[4:])) / sum(userHopMap[4:])
    except Exception as e:
        print('We caught it here '+ str(e))
    finally:
        os.remove(tempFilePath)
        os.remove(userAudioFilePath)

    return (pitchPercent, intonationPercent, rhythmPercent, 1)

def generateGroqResponse(prompt: str, model: str) -> str:
    print(f'Using model: {model}')
    client = Groq(
        api_key=os.getenv('GROQ_API_KEY'),
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model=model,
    )

    return chat_completion.choices[0].message.content

@trackAttempts_bp.route('/attempts/user/feedback-for-attempt/<trackAttemptId>', methods=['GET'])
# @token_required
def get_feedback_for_track_attempt(trackAttemptId):
    '''GET route which dynamically generates feedback for user's track attempts
    usage:
    GET /attempts/user/feedback-for-attempt/testingTrackAttempt?model=gemma-7b-it
    Response 200 returns:
    {
        'pitch': float,
        'intonation': float,
        'rhythm': float,
        'dynamics': float,
        'groqSays': str
    }
    For pitch: 1 = all correct notes, 0 = no correct notes
    For intonation: 1 = perfect, 0 = intonation is terrible
    For rhythm: greater than 1 = dragging, lower than 1 = rushing
    For dynamics: 1 = dynamics are perfect, 0 = dynamics are awful

    Note the query parameter to specify AI model is optional.
    e.g GET /attempts/user/feedback-for-attempt/testingTrackAttempt

    If no model is specified, groq will be passed `llama3-8b-8192` by default.\n
    Working models are specified in allowedModels below, if any other model is tried,
    this route returns a bad request response.
    '''
    allowedModels = set([
        'gemma2-9b-it',
        'gemma-7b-it',
        'llama3-groq-70b-8192-tool-use-preview',
        'llama-3.1-70b-versatile',
        'llama-3.1-8b-instant',
        'llama-3.2-1b-preview',
        'llama-3.2-3b-preview',
        'llama-3.2-11b-vision-preview',
        'llama-3.2-90b-vision-preview',
        'llama3-70b-8192',
        'llama3-8b-8192',
        'mixtral-8x7b-32768',
        # The models below are listed on groq's api but don't
        # work with our implementation
        # 'distil-whisper-large-v3-en',
        # 'llama3-groq-8b-8192-tool-use-preview',
        # 'llama-guard-3-8b',
        # 'whisper-large-v3',
        # 'whisper-large-v3-turbo'
    ])

    db = boto3.resource(
        service_name='dynamodb',
        region_name='ap-southeast-2',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )

    # our default model is 'llama3-8b-8192'
    model = 'llama3-8b-8192'
    if len(request.query_string) == 0:
        model = 'llama3-8b-8192'
    elif request.args.get('model') in allowedModels:
        model = request.args.get('model')
    else:
        return jsonify({'error': 'Unrecognised model type'}), 400

    trackAttempts = db.Table(os.getenv('DYNAMODB_TABLE_TRACK_ATTEMPTS'))
    response = trackAttempts.get_item(Key={'id': trackAttemptId})
    if 'Item' not in response:
        return jsonify({'error': 'Track attempt not found'}), 404

    trackAttemptData = response['Item']
    metrics = generateMetricsForSubmission(trackAttemptData['id'], trackAttemptData['songDetails']['id'])
    prompt = f'''
        I want to generate a feedback report for a user playing the piano, do not format your response in a way that addresses my prompt in any way.
        Their attempt of the song has been measured with the following metrics where a value of 1 is perfect:

        In rhythm, the user scored a value of {metrics[2]}, if it is greater than 1, they were generally dragging, if the value is lower than 1, they were generally rushing
        In pitch, the user scored a value of {metrics[0]}, if it is 1, then they played all the correct notes, if it is 0 they played none of the correct notes.
        In intonation, the user scored a value of {metrics[1]}, if it is 1, then their intonation is perfect, if it is 0, their intonation is terrible
        In dynamics, the user scored a value of {metrics[3]}, if it is 1, then their dynamics are perfect, if it is 0, their dynamics are terrible

        You are solely generating a feedback report for the user to look at.
        Make sure to include advice for the user specific to their instrument.

        The structure of your report should be one paragraph for an introduction, and then one paragraph for each metric. Each paragraph should be around 150 words.
        In each paragraph for each metric, include what they did well, what they did poorly, and how they can improve.

        Don't explicitly mention the values of the metric, only describe their implications.
        Start your feedback with a friendly manner and have the introduction paragraph be exactly one paragraph.
    '''

    groqSays = generateGroqResponse(prompt, model)
    updateAchievements(trackAttemptId, metrics)

    return jsonify({
        'pitch': metrics[0],
        'intonation': metrics[1],
        'rhythm': metrics[2],
        'dynamics': metrics[3],
        'groqSays': groqSays
    }), 200

@trackAttempts_bp.route('/track-attempt/<trackAttemptId>', methods=['GET'])
@token_required
def get_details_for_track_attempt(trackAttemptId):
    '''
    GET route for the details of a track attempt
    route parameter should be as follows
    {
        trackAttemptId: str                 id for the track attempt
    }

    returns
    {
        'id': str                           id for the track attempt
        'isoUploadTime': str                date that the track attempt was uploaded
        'reviews': list[str]                list of ids for reviews
        'songId': str                       id of the song
        'userId': str                       id of the user attempting the track

    }
    '''
    details = getTrackAttempyDetails(trackAttemptId)

    return jsonify(details), 200


@trackAttempts_bp.route('/track-attempt/history/<userId>', methods=['Get'])
@token_required
def get_user_history(userId):
    '''
    GET route for the trackAttempt history of a user
    {
        userId: str                 id for the user
    }

    returns
    {
    [
        "songTitle": songData['title'],
        "songComposer": songData['composer'],
        "songDifficulty": songData['difficulty'],
        "songThumbnail": songData['thumbnail'],
        "isoUploadTime": trackAttemptData['isoUploadTime']
    ]
    }
    '''
    try:
        userDetails = getUserDetails(userId)

        trackAttempts = userDetails['track_attempts']
        trackAttemptDetails = []
        for trackAttempt in trackAttempts:
            trackAttemptData = getTrackAttempyDetails(trackAttempt)
            songData = trackAttemptData['songDetails']
            obj = {
                "songTitle": songData['title'],
                "songComposer": songData['composer'],
                "songDifficulty": songData['difficulty'],
                "songThumbnail": songData['thumbnail'],
                "isoUploadTime": trackAttemptData['isoUploadTime'],
                "trackAttemptId": trackAttempt
            }
            trackAttemptDetails.append(obj)


        return jsonify(trackAttemptDetails), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        })

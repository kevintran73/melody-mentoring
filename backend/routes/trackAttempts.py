from flask import Blueprint
import music21
from dataclasses import dataclass
from typing import List, Union
import tempfile

import boto3
from botocore.client import ClientError
import io
import os
from dotenv import load_dotenv

import librosa
import numpy as np
import matplotlib.pyplot as plt

# from s3_bucket_helpers import createUploadHelper, urlFromBucketObj, uploadFileToBucket
load_dotenv()
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

import sys

trackAttempts_bp = Blueprint('trackAttempts', __name__)

@dataclass
class MusicalElement:
    element_type: str           # 'Note' or 'Chord'
    names: List[str]            # List of note names for chords or a single note name for notes
    frequencies: List[float]    # List of frequencies for chords or a single frequency for notes
    timestamp: float            # Timestamp in seconds
    duration: float             # Duration in seconds
    bar_number: int             # Measure number

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
def extract_notes_and_chords(part, seconds_per_quarter):
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
def processXML(file):
    score = music21.converter.parse(file, format='musicxml')

    # Get BPM and calculate seconds per quarter
    tempo_markings = score.flatten().getElementsByClass(music21.tempo.MetronomeMark)
    bpm = tempo_markings[0].number if tempo_markings else 120
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
'''
data = processXML('testing-files/Ode_to_joy_RightHand.mxl')
print("================== STAFF 1 ==================")
for note in data[0]:
    print(note)

print("================== STAFF 2 ==================")
for note in data[1]:
    print(note)
'''
# sys.exit(1)
# EVERYTHING BELOW IS FOR PARSING RAW AUDIO
file_path = 'testing-files/Ode_to_joy_piano_audio.mp3'
# requires file in raw bytes e.g.
# io.BytesIO(file)
def processUserAudioRaw(file) -> list:
    audio, sr = librosa.load(file)
    stft = np.abs(librosa.stft(audio))
    frequencies = librosa.fft_frequencies(sr=sr)
    times = librosa.times_like(stft, sr=sr)

    res = []
    onset_frames = librosa.onset.onset_detect(y=audio, sr=sr, delta=0.06, hop_length=512)
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
    # print(f"Time: {time:.2f}s, Frequency: {freq:.2f} Hz, Note: {note}, Loudness: {amplitude:.2f} dB")
# onset_times = librosa.frames_to_time(onset_frames, sr=sr)

# plt.figure(figsize=(14, 6))
# librosa.display.waveshow(audio, sr=sr, alpha=0.6)

# for onset in onset_times:
#     plt.axvline(x=onset, color='r', linestyle='--', label='Onset' if onset == onset_times[0] else "")

# plt.xlabel("Time (s)")
# plt.ylabel("Amplitude")
# plt.title("Waveform with Onset Detection")
# plt.legend()
# plt.show()

s3_client = boto3.client(
    service_name='s3',
    region_name='ap-southeast-2',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key
)

def generateResultForSubmission():
    getUserAudioSubmission = s3_client.get_object(Bucket=os.getenv('S3_BUCKET_USER_AUDIO'), Key='Ode_to_joy_piano_audio.mp3')
    userAudio = getUserAudioSubmission['Body'].read()
    # A bit cursed but windows gives us permission errors if we try to open the file directly
    # instead we write to a temporary file and leave it open to process the .mxl file
    # afterwards we have to do the cleanup. This only applies to music21.converter. Librosa is happy
    # to parse the file in raw bytes.
    getTrackAudioRes = s3_client.get_object(Bucket=os.getenv('S3_BUCKET_TRACK_SHEET'), Key='Ode_to_joy_RightHand.mxl')
    trackAudio = getTrackAudioRes['Body'].read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mxl") as tempFile:
        tempFile.write(trackAudio)
        tempFilePath = tempFile.name
    try:
        data = processXML(tempFilePath)
        melodyNotes: list[MusicalElement] = data[1]
        dynamics = data[2]
        songBPM = data[3]
        userAttemptData = processUserAudioRaw(io.BytesIO(userAudio))
        from pprint import pprint
        pprint(userAttemptData)
    finally:
        os.remove(tempFilePath)

generateResultForSubmission()

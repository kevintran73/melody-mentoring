from flask import Blueprint
import music21
from dataclasses import dataclass
from typing import List, Union

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
    score = music21.converter.parse(file)

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

import librosa
import numpy as np
import matplotlib.pyplot as plt

# Load the audio file
file_path = 'testing-files/Ode_to_joy_piano_audio.mp3'
audio, sr = librosa.load(file_path)

# Analyze the STFT
stft = np.abs(librosa.stft(audio))
frequencies = librosa.fft_frequencies(sr=sr)
times = librosa.times_like(stft, sr=sr)

# Detect onsets (when notes start)
onset_frames = librosa.onset.onset_detect(y=audio, sr=sr, delta=0.06, hop_length=512)
# Get note frequencies and amplitude
for onset in onset_frames:
    # Convert onset frame to time
    time = librosa.frames_to_time(onset, sr=sr)
    # Slice the STFT for a short window around the onset
    frame_slice = stft[:, onset:onset + 5]  # Sample of frames around onset
    # Get loudness
    amplitude = np.mean(librosa.amplitude_to_db(frame_slice))
    # Detect main frequency in this slice
    freq_index = np.argmax(np.mean(frame_slice, axis=1))
    freq = frequencies[freq_index]
    # Convert frequency to note
    note = librosa.hz_to_note(freq)

    print(f"Time: {time:.2f}s, Frequency: {freq:.2f} Hz, Note: {note}, Loudness: {amplitude:.2f} dB")

onset_times = librosa.frames_to_time(onset_frames, sr=sr)

# Plot the waveform
plt.figure(figsize=(14, 6))
librosa.display.waveshow(audio, sr=sr, alpha=0.6)

# Mark onsets
for onset in onset_times:
    plt.axvline(x=onset, color='r', linestyle='--', label='Onset' if onset == onset_times[0] else "")

# Add labels and legend
plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.title("Waveform with Onset Detection")
plt.legend()
plt.show()

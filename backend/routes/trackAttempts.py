from flask import Blueprint
import music21
from dataclasses import dataclass
from typing import List, Union

trackAttempts_bp = Blueprint('trackAttempts', __name__)

@dataclass
class MusicalElement:
    element_type: str  # 'Note' or 'Chord'
    names: List[str]   # List of note names for chords or a single note name for notes
    frequencies: List[float]  # List of frequencies for chords or a single frequency for notes
    timestamp: float   # Timestamp in seconds
    duration: float     # Duration in seconds
    bar_number: int     # Measure number

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
    left_hand_elements = extract_notes_and_chords(score.parts[1], seconds_per_quarter)

    # Iterate through dynamics
    dynamics = []
    for element in score.flatten().getElementsByClass(music21.dynamics.Dynamic):
        timestamp_seconds = element.offset * (60 / bpm)
        dynamics.append((element.value, timestamp_seconds))

    return left_hand_elements, right_hand_elements, dynamics


data = processXML('Ode_to_Joy.mxl')
print("================== STAFF 1 ==================")
for note in data[0]:
    print(note)

print("================== STAFF 2 ==================")
for note in data[1]:
    print(note)


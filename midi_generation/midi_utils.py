import os
import magenta
from magenta.music import sequences_lib
from midiutil.MidiFile import MIDIFile
import argparse
import json
import datetime


midi_drum_mapping_truncation = {

    "kick": {
        "midi_notes" : [36, 35],
        "preferred_note" : 36
    },
    "snare":{
            "midi_notes" : [38, 27, 28, 31, 32, 33, 34, 37, 39, 40, 56, 65, 66, 75, 85],
            "preferred_note" : 38
    },
    "closed_hi_hat":{
            "midi_notes" : [42, 44, 54, 68, 69, 70, 71, 73, 78, 80, 22],
            "preferred_note" : 42
    },
    "open_hi_hat":{
            "midi_notes" : [46, 67, 72, 74, 79, 81, 26],
            "preferred_note" : 46
    },
    "low_tom":{
            "midi_notes" : [45, 29, 41, 43, 61, 64, 84],
            "preferred_note" : 45
    },
    "mid_tom":{
            "midi_notes" : [48, 47, 60, 63, 77, 86, 87],
            "preferred_note" : 48
    },
    "high_tom":{
            "midi_notes" : [50, 30, 62, 76, 83],
            "preferred_note" : 50
    },
    "crash_cymbal":{
            "midi_notes" : [49, 52, 55, 57, 58],
            "preferred_note" : 49
    },
    "ride_cymbal":{
            "midi_notes" : [51, 53, 59, 82],
            "preferred_note" : 51
    }
}


def extract_midi_data_from_midi_file(midifile):
    midi_data = {}
    primer_sequence = magenta.music.midi_file_to_sequence_proto(midifile)
    quantized_sequence = sequences_lib.quantize_note_sequence(primer_sequence,steps_per_quarter=4)
    serialized_notes = []
    for note in quantized_sequence.notes:
        current_note = {}
        preferred_note = None
        for drum in midi_drum_mapping_truncation.keys():
            if note.pitch in midi_drum_mapping_truncation[drum]['midi_notes']:
                preferred_note = midi_drum_mapping_truncation[drum]['preferred_note']
                break
        current_note["pitch"] = preferred_note
        current_note["velocity"] = note.velocity
        current_note["quantized_start_step"] = note.quantized_start_step
        serialized_notes.append(current_note)
    midi_data["notes"] = serialized_notes
    midi_data["ticks_per_quarter"] = quantized_sequence.ticks_per_quarter
    midi_data["tempo"] =  quantized_sequence.tempos[0].qpm
    midi_data["total_quantized_steps"] = quantized_sequence.total_quantized_steps
    return midi_data

def note_sequence_to_midi_file(note_sequence, tempo, length, output_path="output"):
    track    = 0
    channel  = 0
    time     = 0   # In beats
    duration = 0.5   # In beats
    volume   = 100
    tempo = int(tempo)
    length = int(length)
    MyMIDI = MIDIFile(1)
    MyMIDI.addTempo(track, time, tempo)
    note_sequence = eval(note_sequence)
    # Get last note step
    last_note_step = -1
    for note in note_sequence:
        if note['quantized_start_step'] > last_note_step:
            last_note_step = note['quantized_start_step']
    last_note_duration = length - last_note_step
    for note in note_sequence:
        pitch = note['pitch']
        time_step = note['quantized_start_step']
        if time_step == last_note_step:
            MyMIDI.addNote(track, channel, pitch, time_step, last_note_duration, volume)
        else:
            MyMIDI.addNote(track, channel, pitch, time_step, duration, volume)

    midi_date_file = str(datetime.datetime.now()).replace(" ", "_") + ".mid"
    midi_file_path = os.path.join(output_path, midi_date_file)
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    with open(midi_file_path, "wb") as output_file:
        MyMIDI.writeFile(output_file)
    return midi_file_path

def convert_midi_data_to_sequence_list(midi_data):
    midi_notes = midi_data['notes']
    total_steps = midi_data["total_quantized_steps"]
    empty_sequence_list = [[] for i in range(total_steps)]
    for note in midi_notes:
        current_step_idx = note["quantized_start_step"]
        current_pitch = note["pitch"]
        empty_sequence_list[current_step_idx].append(current_pitch)
    sequence_list = [tuple(notes) for notes in empty_sequence_list]
    return sequence_list

def main(args):
    if args.note_sequence_to_midi_file and args.note_sequence and args.tempo and args.length and args.output_path:
        midi_file = note_sequence_to_midi_file(args.note_sequence, args.tempo, args.length, args.output_path)
        print(midi_file)

    if args.extract_midi_data and args.midi_file:
        midi_data = extract_midi_data_from_midi_file(args.midi_file)
        print(midi_data["notes"])
        print(midi_data["tempo"])
        print(midi_data["total_quantized_steps"])
        print(midi_data["ticks_per_quarter"])

    if args.convert_midi_data_to_sequence and args.midi_data:
        sequence_list =convert_midi_data_to_sequence_list(args.midi_data)
        print(sequence_list)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Midi Utils')
    parser.add_argument('--extract_midi_data')
    parser.add_argument('--convert_midi_data_to_sequence')
    parser.add_argument('--note_sequence_to_midi_file')
    parser.add_argument('--midi_file')
    parser.add_argument('--midi_data')
    parser.add_argument('--note_sequence')
    parser.add_argument('--tempo')
    parser.add_argument('--length')
    parser.add_argument('--output_path')
    args = parser.parse_args()
    main(args)
import magenta
from magenta.music import sequences_lib
import argparse
import json

def extract_midi_data_from_midi_file(midifile):
    midi_data = {}
    primer_sequence = magenta.music.midi_file_to_sequence_proto(midifile)
    quantized_sequence = sequences_lib.quantize_note_sequence(primer_sequence,steps_per_quarter=4)
    serialized_notes = []
    for note in quantized_sequence.notes:
        current_note = {}
        current_note["pitch"] = note.pitch
        current_note["velocity"] = note.velocity
        current_note["end_time"] = note.end_time
        current_note["quantized_start_step"] = note.quantized_start_step
        serialized_notes.append(current_note)
    midi_data["notes"] = serialized_notes
    midi_data["ticks_per_quarter"] = quantized_sequence.ticks_per_quarter
    midi_data["tempo"] =  quantized_sequence.tempos[0].qpm
    midi_data["total_quantized_steps"] = quantized_sequence.total_quantized_steps
    return midi_data

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
    if args.extract_midi_data and args.midi_file:
        midi_data = extract_midi_data_from_midi_file(args.midi_file)
        print(midi_data["notes"])
        print(midi_data["tempo"])
        print(midi_data["total_quantized_steps"])
        print(midi_data["ticks_per_quarter"])

    elif args.convert_midi_data_to_sequence and args.midi_data:
        sequence_list =convert_midi_data_to_sequence_list(args.midi_data)
        print(sequence_list)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Midi Utils')
    parser.add_argument('--extract_midi_data')
    parser.add_argument('--convert_midi_data_to_sequence')
    parser.add_argument('--midi_file')
    parser.add_argument('--midi_data')
    args = parser.parse_args()
    main(args)
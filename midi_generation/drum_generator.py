import os
import sys
import argparse
import subprocess
from S3 import S3
from midi_utils import *
import requests
from S3.settings import *

def generate_and_upload_drum_rnn_midi_sequence(args):
    current_dir = os.path.dirname(os.path.realpath(__file__))
    output_dir = os.path.join(current_dir, "output")
    model_dir = os.path.join(current_dir, "assets/MLmodels")
    model_path = os.path.join(model_dir, "drum_kit_rnn.mag")
    if not os.path.exists(model_path):
        url = os.path.join(S3_URL, "models", "drum_kit_rnn.mag")
        r = requests.get(url, allow_redirects=True)
        myfile = requests.get(url)
        open(model_path, 'wb').write(myfile.content)
    #TODO switch to subprocess
    os.system('drums_rnn_generate '
              ' --config="drum_kit" '
              ' --bundle_file="{}"'
              ' --output_dir="{}"'
              ' --num_outputs=1 '
              ' --num_steps={}'
              ' --primer_drums="{}"'.format(model_path, output_dir, args.num_steps, args.primer_drums))
    list_of_files = [os.path.join(os.getcwd(), output_dir, file) for file in os.listdir(output_dir)]
    latest_file = max(list_of_files, key=os.path.getctime)
    midi_sequence = extract_midi_data_from_midi_file(latest_file)['notes']
    S3.initialize()
    s3_path = S3.upload_file(latest_file, object_name='midi/{}/{}'.format(args.username.replace(" ","_"), os.path.split(latest_file)[-1]))
    os.remove(latest_file)
    print(s3_path)
    print(midi_sequence)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Drum RNN Generation')
    parser.add_argument('--num_steps')
    parser.add_argument('--primer_drums')
    parser.add_argument('--username')
    args = parser.parse_args()
    generate_and_upload_drum_rnn_midi_sequence(args)

import os
import sys
import argparse
import subprocess
from S3 import S3
import requests

def main(args):
    if not os.path.exists("assets/MLmodels/drum_kit_rnn.mag"):
        url = "https://midi-mason.s3-us-west-2.amazonaws.com/models/drum_kit_rnn.mag"
        r = requests.get(url, allow_redirects=True)
        myfile = requests.get(url)
        open('midi_generation/assets/MLmodels/drum_kit_rnn.mag', 'wb').write(myfile.content)
    os.system('drums_rnn_generate '
              ' --config="drum_kit" '
              ' --bundle_file="midi_generation/assets/MLmodels/drum_kit_rnn.mag"'
              ' --output_dir=midi_generation/output'
              ' --num_outputs=1 '
              ' --num_steps={}'
              ' --primer_drums="{}"'.format(args.num_steps, args.primer_drums))
    list_of_files = [os.path.join(os.getcwd(), "midi_generation/output", file) for file in os.listdir("midi_generation/output")]
    latest_file = max(list_of_files, key=os.path.getctime)
    S3.initialize()
    s3_path = S3.upload_file(latest_file, object_name='midi/{}'.format(os.path.split(latest_file)[-1]))
    print(s3_path)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Drum RNN Generation')
    parser.add_argument('--num_steps')
    parser.add_argument('--primer_drums')
    args = parser.parse_args()
    main(args)
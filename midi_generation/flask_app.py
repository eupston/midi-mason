import os
from flask import Flask, request, jsonify, send_from_directory


app = Flask(__name__)

# type (rythm or melody)
# rating
# genre
# tempo
# length
# id
# name
# Author
# analysis midi content on file upload tempo etc

@app.route('/')
def index():
    return 'Index Page'


@app.route('/test', methods=['GET'])
def test():
    return"test"


@app.route('/api/v1/generate_drum_rnn',methods=['POST'])
def drums_generate_rnn_from_list():
    data = request.json
    num_steps = data["num_steps"]
    primer_drums = data["primer_drums"]
    os.system('drums_rnn_generate '
              ' --config="drum_kit" '
              ' --bundle_file="assets/MLmodels/drum_kit_rnn.mag"'
              ' --output_dir=output'
              ' --num_outputs=1 '
              ' --num_steps={} '
              ' --primer_drums="{}"'.format(num_steps, primer_drums))
    list_of_files = [os.path.join(os.getcwd(), "midi_generation/output" + file) for file in os.listdir('output')]
    latest_file = max(list_of_files, key=os.path.getctime)
    try:
        return send_from_directory("output", filename=os.path.split(latest_file)[1], as_attachment=True)
    except FileNotFoundError:
        abort(404)


@app.route('/api/v1/generate_drum_rnn_midifile', methods=['POST'])
def drums_generate_rnn_sequence_from_midi():
    f = request.files['midi_file']
    f.save('output/uploaded_midi.mid')
    os.system('drums_rnn_generate '
              ' --config="drum_kit" '
              ' --bundle_file="assets/MLmodels/drum_kit_rnn.mag"'
              ' --output_dir=output'
              ' --num_outputs=1 '
              ' --num_steps=128 '
              ' --primer_midi={}'.format("output/uploaded_midi.mid"))
    list_of_files = [os.path.join(os.getcwd(), "output/" + file) for file in os.listdir('output')]
    latest_file = max(list_of_files, key=os.path.getctime)
    try:
        return send_from_directory("output", filename=os.path.split(latest_file)[1], as_attachment=True)
    except FileNotFoundError:
        abort(404)

@app.errorhandler(404)
def page_not_found(error):
    return 404


if __name__ == '__main__':
    app.run(debug=True)

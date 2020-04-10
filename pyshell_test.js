let {PythonShell} = require('python-shell')

let options = {
    mode: 'text',
    pythonPath: "venv/bin/python",
    args:['--num_steps', '32', "--primer_drums", "[]"]
};

PythonShell.run('drum_generator.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
});



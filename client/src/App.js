import React, {Component} from 'react';
import './App.css';
import DrumSequencer from "./components/Sequencer/DrumSequencer/DrumSequencer";
import MidiCards from "./components/Midi/MidiCards/MidiCards";
import {Route, Switch} from "react-router-dom";

class App extends Component {
  render() {
    return (
        <Switch>
            <Route path={"/sequencer"} render={() => <DrumSequencer pattern={[]} totalSteps={8}/>}/>
            <Route path='/' exact render={() =><MidiCards/>}/>
        </Switch>
    );
  }
}

export default App;
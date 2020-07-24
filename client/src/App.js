import React, {Component} from 'react';
import './App.css';
import DrumSequencer from "./components/DrumSequencer/DrumSequencer";
import {Route, Switch} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Auth/Login/Login";
import ResetPassword from "./components/Auth/ResetPassword/ResetPassword";
import Logout from "./components/Auth/Logout/Logout";
import Signup from "./components/Auth/Signup/Signup";
import Account from "./components/Auth/Account/Account";
import MyBeats from "./containers/MyBeats/MyBeats";
import MidiCollections from "./containers/MidiCollections/MidiCollections";
import Contact from "./components/Contact/Contact";

//TODO bug with audio buffer not clearing on start and stop
class App extends Component {
  render() {
    return (
        <div className='App' >
            <Navbar/>
            <Switch>
                <Route path='/login' render={() => <Login redirect={true} />} />
                <Route path='/reset-password' render={() => <ResetPassword/>} />
                <Route path='/logout' render={() => <Logout/>} />
                <Route path='/signup' render={() => <Signup redirect={true} />} />
                <Route path='/account' render={() => <Account/>}/>
                <Route path={"/sequencer"} render={() => <DrumSequencer pattern={[]} totalSteps={8}/>}/>
                <Route path={"/mybeats"} render={() => <MyBeats/>}/>
                <Route path={"/contact"} render={() => <Contact/>}/>
                <Route path='/' exact render={() =><MidiCollections/>}/>
            </Switch>
        </div>
    );
  }
}

export default App;
import React from 'react';
import LoggedIn from './logged-in.js';
import LoggedOut from './logged-out.js';
import Api from './api.js'
import './app.css';

class App extends Api {
        componentWillMount = () => {
                this.stateComponentWillMount()
                this.apiComponentWillMount()
        }
        render = () => {
                console.log(this.state)
                if ( false === this.state.didPing ) {
                        return (
                                <div className="App">Checking log in information, hold please.</div>
                        );
                }
                if ( false === this.state.loggedIn ) {
                        return (
                                <div className="App">
                                <LoggedOut/>
                                <button onClick={this.setLoggedIn}>test</button>
                                <button onClick={this.test}>test2</button>
                                </div>
                        );
                }
                return (
                        <div className="App">
                        <LoggedIn state={this.state}/>
                        </div>
                );
        }
}

export default App;

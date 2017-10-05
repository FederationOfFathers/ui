import React from 'react';
import LoggedIn from './logged-in.js';
import Api from './api.js'
import './app.css';

class App extends Api {
	componentWillMount = () => {
		this.stateComponentWillMount()
		this.apiComponentWillMount()
	}
	render = () => {
		if ( false === this.state.loggedIn || false === this.state.didPing ) {
			return (
				<div className="app noauth">
					<h1>Please log in.</h1>
					<p>Send a message of just "login" to @damnbot in slack. Click the link he replies with.</p>
				</div>
			);
		}
		return ( <LoggedIn state={this.state}/> );
	}
}

export default App;

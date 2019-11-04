import React from 'react';
import LoggedIn from './logged-in.js';
import Api from './api.js'
import './App.css';
import Logout from './logout';

class App extends Api {
	componentDidUpdate = () => {
		this.save()
	}
	componentWillMount = () => {
		this.stateComponentWillMount()
		this.apiComponentWillMount()
	}
	componentDidMount = () => {
		this.setState({
			copied: false,
			loginCode: false,
			logincheck: false,
			fetchingLoginCode: false,
		})
	}
	logoutClick = () => {
        document.cookie = "secure-cookie=;path=/;domain=fofgaming.com;expires=-1";
        window.location.reload(false)
    }
	stillChecking = () => {
		return(<div className="my-5 text-center">
			<h1>Checking Login Status</h1>
			<p>This should only take a few seconds</p>
			<small><button className="btn btn-link btn-sm" onClick={this.logoutClick}>click here to logout of old sessions</button><br/>especially old Slack sessions</small>
			</div>)
	}
	pleaseLogIn = () => {
		// todo pull from api
		const discordLoginURL = "https://discordapp.com/api/oauth2/authorize?client_id=447447191640997888&redirect_uri=https%3A%2F%2Fdashboard.fofgaming.com%2Fapi%2Fv1%2Foauth%2Fdiscord%2Flogin&response_type=code&scope=identify&state=login"
		return(
			<div className="app noauth text-left my-5">
				<div className="mx-auto d-flex flex-column align-items-center">
					<h2 className="d-flex text-center"><span className="px-md-3" role="img" aria-label={'point down'}>👇 👇</span>Login With Discord<span className="px-md--3" role={'img'} aria-label={'point down'}>👇 👇</span></h2>
					<div className="field discord w-100 py-2">
						<a className="btn btn-block btn-lg text-center" style={{ backgroundColor: "#7289DA"}} href={discordLoginURL}><img className="img-fluid h-100" src="/images/discord-logo-white.png" alt="Discord"/></a>
					</div>
					<h2><span role="img" aria-label={'point up'}> 👆 👆 </span></h2>
					<p>
					<ol>
						Instructions
						<li>Click the link above</li>
						<li>Login to Discord</li>
						<li>Click the "Authorize" button</li>
						<li>Be logged in</li>
					</ol>
					</p>
				</div>
			</div>
		)
	}

	render = () => {
		if ( false === this.state.loggedIn ) {
			return this.pleaseLogIn()
		}
		if ( false === this.state.verified  ) {
			return (
				<div className="alert alert-danger">
					<p>You must be verified to use the team tool.</p>
					<p>If you haven't logged in with Discord before, logout, and then log back in with Discord.</p>
					<Logout/>
				</div>
			)
		}
		return ( <LoggedIn state={this.state}/> );
	}
}

export default App;

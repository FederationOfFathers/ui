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

		const discordLoginURL = "https://discordapp.com/api/oauth2/authorize?client_id=447447191640997888&redirect_uri=https%3A%2F%2Fdashboard.fofgaming.com%2Fapi%2Fv1%2Foauth%2Fdiscord%2Flogin&response_type=code&scope=identify&state=login"
		const discordInviteURL = "https://discord.gg/WAgSs2Y";
		return(
			<div className="app noauth text-left my-5">
				<div className="text-center">
					<h2>Login With Discord</h2>
					<div className="field discord">
						<p className="helper-text">You need to be verified in the <a href={discordInviteURL}>FoF Discord</a> to be able to login.</p>
						<a className="btn btn-block btn-lg text-center" style={{ backgroundColor: "#7289DA"}} href={discordLoginURL}><img className="img-fluid h-100" src="/images/discord-logo-white.png" alt="Discord"/></a>
						<p><a href={discordInviteURL}>Join FoF! - {discordInviteURL}</a></p>
						<small className="helper-text text-black-50">Slack is no more. All hail Discord!</small><br/>
						<small className="text-black-50">if this doesn't work, it's because it's not done</small>
					</div>
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

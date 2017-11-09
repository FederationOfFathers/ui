import React from 'react';
import LoggedIn from './logged-in.js';
import Api from './api.js'
import Clipboard from 'react-clipboard.js';
import './App.css';

class App extends Api {
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
	stillChecking = () => {
		return(<div className="my-5 text-center">
			<h1>Checking Login Status</h1>
			<p>This should only take a few seconds</p>
			</div>)
	}
	code = () => {
		if ( typeof this.state.loginCode === "undefined" || ! this.state.loginCode ) {
			return null
		}
		var copied = null
		if ( this.state.copied ) {
			copied = (<div className="my-1 alert alert-success" role="alert">code copied to clipboard</div>)
		}
		return (
			<div>
				<div className="input-group">
					<input onChange={()=>{}}id="logincode" className="font-weight-bold form-control text-center text-uppercase" value={this.state.loginCode}/>
					<Clipboard className="btn btn-primary" data-clipboard-text={this.state.loginCode} onSuccess={()=>{
						this.setState({copied: true})
					}}>
						&#x2398; copy code
					</Clipboard>
				</div>
				{copied}
			</div>
		)
	}
	newCode = () => {
		return this.fetch("login/get")
			.then(function(response) {
				return response.json()
			})
			.then((json) => {
				this.setState({loginCode: json, copied: false})
			})
	}
	pleaseLogIn = () => {
		if ( this.state.loginCode === false ) {
			if ( this.state.fetchingLoginCode === false ) {
				this.setState({fetchingLoginCode: true})
				this.newCode()
					.then(() =>{
						this.setState({
							fetchingLoginCode: false,
							loginChecker: window.setInterval(this.loginChecker, 1000),
						})
				})
			}
		}
		return(
			<div className="app noauth text-left my-5">
				<h1 className="text-center">Please log in.</h1>
				<p className="text-center">Follow the steps below to log in</p>
				<p><strong>1 -</strong> Copy the code by clicking the button below</p>
				<div style={{marginBottom: "1em"}}>{this.code()}</div>
				<p><strong>2 -</strong> Click the button below to message damnbot</p>
				<p className="text-center"><a href="slack://user?team=T0381RKM5&id=U1CR4ML94" className="w-50 btn btn-primary">@damnbot</a></p>
				<p><strong>3 -</strong> Paste the code and push send</p>
				<p><strong>4 -</strong> Return to this page to be logged in</p>
				<p><strong>5 -</strong> Shenanigans</p>
				<p>If you’re having problems visit the channel with the button below and let us know</p>
				<p className="text-center"><a className="w-50 btn btn-primary"  href="slack://user?team=T0381RKM5&id=C3GQM9N9H">#dashboard-help</a></p>
			</div>
		)
	}
	loginChecker = () => {
		this.fetch("login/check/" + this.state.loginCode)
			.then(function(response) {
				return response.json()
			})
			.then((json) => {
				switch(json) {
					case "ok":
						if ( this.state.loginChecker !== false ) {
							window.clearInterval(this.state.loginChecker)
						}
						this.ping()
						return
					case "wait":
						return
					case "gone":
						this.newCode()
						return
					default:
						console.log("check")
						console.log(json)
						return
				}
			})
	}
	render = () => {
		if ( false === this.state.checkedAuth ) {
			return this.stillChecking()
		}
		if ( false === this.state.loggedIn ) {
			return this.pleaseLogIn()
		}
		new window.Clipboard('.btn')
		return ( <LoggedIn state={this.state}/> );
	}
}

export default App;

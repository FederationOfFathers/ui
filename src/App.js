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
						<span className="input-group-addon" id="basic-addon1">code</span>
						<input onChange={()=>{}}id="logincode" className="font-weight-bold form-control text-center text-uppercase" value={this.state.loginCode}/>
						<Clipboard className="btn input-group-addon" data-clipboard-text={this.state.loginCode} onSuccess={()=>{
							this.setState({copied: true})
						}}>
							<img style={{height: "1em"}} src="/clippy.svg" alt="Copy to clipboard"/>
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
			<div className="app noauth text-center my-5">
				<h1>Please log in.</h1>
				<p>Send the following code to <span className="text-primary">@damnbot</span> in slack</p>
				{this.code()}
				<p className="my-3 py-2 px-2 text-justify">
					Once you have sent the code in a direct message to <span className="text-primary">@damnbot </span>
					in slack you can come back here and you should get
					automatically logged in.
				</p>
				<p className="my-3 py-2 px-2 text-justify">
					It doesn't matter if you send upper or lower case letters.
				</p>
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

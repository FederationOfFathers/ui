import React from 'react';
import LoggedIn from './logged-in.js';
import Api from './api.js'
import './App.css';

class App extends Api {
	componentWillMount = () => {
		this.stateComponentWillMount()
		this.apiComponentWillMount()
	}
	componentDidMount = () => {
		this.setState({
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
		var rval = []
		if ( typeof this.state.loginCode === "undefined" ) {
			return rval
		}
		if ( !this.state.loginCode ) {
			return rval
		}
		for ( var i=0; i<this.state.loginCode.length; i++ ) {
			var classN = "mx-2 badge badge-primary"
			if ( this.state.loginCode[i].match(/^[0-9]$/) ) {
				classN = "mx-2 badge badge-secondary"
			}
			rval.push((
				<span style={{fontFamily: '"Lucida Console", Monaco, monospace'}} className={classN} key={i}>{this.state.loginCode[i]}</span>
			))
		}
		return rval
	}
	newCode = () => {
		return this.fetch("login/get")
			.then(function(response) {
				return response.json()
			})
			.then((json) => {
				this.setState({loginCode: json})
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
				<h2 style={{textTransform: "uppercase"}}>{this.code()}</h2>
				<p className="my-3 py-2 px-2 text-secondary text-justify bg-light">
					Letters in the code are blue, and numbers are gray, to make it easier to tell the difference. You can send upper or lower case letters to damnbot, both will work
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
		return ( <LoggedIn state={this.state}/> );
	}
}

export default App;

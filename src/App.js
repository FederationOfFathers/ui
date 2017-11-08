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
		for ( var i=0; i<this.state.loginCode.length; i++ ) {
			rval.push((
				<span style={{fontFamily: '"Lucida Console", Monaco, monospace'}} className="mx-2 badge badge-primary" key={i}>{this.state.loginCode[i]}</span>
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
			this.newCode()
				.then(() =>{
					this.setState({
						loginChecker: window.setInterval(this.loginChecker, 1000),
					})
				})
		}
		return(
			<div className="app noauth text-center my-5">
				<h1>Please log in.</h1>
				<p>Send the following code @damnbot in slack</p>
				<h2>{this.code()}</h2>
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

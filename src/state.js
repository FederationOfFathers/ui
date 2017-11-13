import { Component } from 'react';
import moment from 'moment';
import Hash from 'hash-handler';

const hash = Hash();

class State extends Component {
	callbacks = () => {
		return {
			'team': {
				setHostMoment: this.setHostMoment,
			},
			days: (num) => {
				this.setState({days: num})
			},
		}
	}
	stateComponentWillMount = () => {
		this.setState({
			days: 7,
			lastRaidFetch: null,
			lastPingFetch: null,
			lastChannelsFetch: null,
			lastGroupsFetch: null,
			lastUsersFetch: null,
			raidbotToken: false,
			raids: {},
			raidHost: {
				m: moment(),
				title: "",
			},
			didPing: false,
			loggedIn: false,
			vars: hash.get(),
			hasher: hash,
			hashString: window.location.hash,
			windowHeight: window.innerHeight,
			windowWidth: window.innerWidth,
			navHeight: 0,
			setNavHeight: this.setNavHeight,
			callbacks: this.callbacks(),
			meta: {
				users: {},
				streams: {},
			}
		})
		this.callbacks();
		hash.registerListener(this.hashChange);
		window.onresize = function() {
			this.setState({
				windowHeight: window.innerHeight,
				windowWidth: window.innerWidth,
			})
		}.bind(this)
	}
	setHostMoment = ( m ) => {
		var host = this.state.raidHost
		host.m = m
		this.setState({raidhost: host})
		this.save()
	}
	setNavHeight = ( height ) => {
		this.setState({ navHeight: height })
	}
	hashChange = () => {
		this.setState({
			vars: this.state.hasher.get(),
			hashString: window.location.hash,
		})
	}
	save = () => {
		// clean certain parts of the state
		var s = JSON.parse( JSON.stringify( this.state ) )
		s.meta = {
			users: {},
			streams: {},
		}
		s.vars = {}
		localStorage.setItem("fofstate", JSON.stringify( s ) )
	}
	load = () => {
		// return // testing
		try {
			var value = JSON.parse(localStorage.getItem("fofstate"));
			if ( "object" !== typeof value ) {
				return
			}
			if ( value === null ) {
				return
			}
			value.checkedAuth = false
			value.hasher = hash
			value.vars = hash.get()
			value.hashString = window.location.hash
			value.callbacks = this.callbacks();
			value.raidHost = {
				m: moment(),
				title: "",
			}
			value.meta = {
				users: {},
				streams: {},
			}
			this.setState(value)
		} catch(e) {
			return
		}
	}
}

export default State

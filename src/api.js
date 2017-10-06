import 'whatwg-fetch'
import State from './state.js'

class Api extends State {
	apiComponentWillMount = () => {
		this.load()
		this.ping()
		this.setState({api: {
			slack: {
				join: this.joinSlack,
				part: this.partSlack,
			},
			team: {
				host: this.raidHost,
				leave: this.raidLeave,
				join: this.raidJoin,
				ping: this.raidPing,
				close: this.raidClose,
			}
		}})
		setInterval(function(){
			this.ping()
			this.channels()
			this.url()
		}.bind(this), 60000)
	}
	url = ( part ) => {
		return "//dashboard.fofgaming.com/api/v0/" + part
	}
	fetch = ( what ) => {
		if ( what.substring(0, 2) !== "//" ) {
			what = this.url( what );
		}
		return fetch(what, { credentials: 'include' })
	}
	raidfetch = ( what ) => {
		return fetch(
			"//team.fofgaming.com/rest/" + what,
			{
				headers: {
					'Authorization': this.state.raidbotToken,
				},
			}
		)
	}
	raidpost = ( what, body ) => {
		return fetch(
			"//team.fofgaming.com/rest/" + what,
			{
				body: body,
				method: 'POST',
				headers: {
					'Authorization': this.state.raidbotToken,
				},
			}
		)
	}
	raidList = () => {
		return this.raidfetch("get")
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({raids: json})
			}.bind(this))
	}
	raidJoin = ( body ) => {
		return this.raidpost( 'raid/join', body )
			.then(function() {
				this.raidList()
			}.bind(this))
	}
	raidLeave = ( body ) => {
		return this.raidpost( 'raid/leave', body )
			.then(function() {
				this.raidList()
			}.bind(this))
	}
	raidHost = ( body ) => {
		return this.raidpost( 'raid/host', body )
			.then(function() {
				this.raidList()
			}.bind(this))
	}
	raidPing = ( body ) => {
		return this.raidpost( 'raid/ping', body )
			.then(function() {
				this.raidList()
			}.bind(this))
	}
	raidClose = ( body ) => {
		return this.raidpost( 'raid/finish', body )
			.then(function() {
				this.raidList()
			}.bind(this))
	}
	users = () => {
		return this.fetch("xhr/users/v1/users.json")
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({users: json})
			}.bind(this))
	}
	channels = () => {
		return this.fetch("channels")
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({chanList: json})
			}.bind(this))
	}
	raidbotAuth = () => {
		return this.fetch("auth/team-tool")
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({raidbotToken: "fof-ut " + json})
				this.raidList()
			}.bind(this))
	}
	groups = () => {
		return this.fetch("groups")
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({groupList: json})
			}.bind(this))
	}
	joinSlack = (id, kind) => {
		console.log("join " + id + " " + kind)
		var op = null
		var on = null
		if ( kind === "channel" ) {
			on = this.channels
			op = this.fetch("channels/"+id+"/join")
		} else {
			on = this.groups
			op = this.fetch("groups/"+id+"/join")
		}
		op.then(setTimeout(function() {
			this.ping()
			on()
		}.bind(this), 2500))
	}
	partSlack = (id, kind) => {
		var op = null
		var on = null
		if ( kind === "channel" ) {
			on = this.channels
			op = this.fetch("channels/"+id+"/leave")
		} else {
			on = this.groups
			op = this.fetch("groups/"+id+"/leave")
		}
		op.then(setTimeout(function() {
			this.ping()
			on()
		}.bind(this), 2500))
		console.log("part " + id + " " + kind)
	}
	ping = () => {
		this.fetch( "ping" )
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				if ( typeof json.user === "undefined" ) {
					this.setState({loggedIn: false})
					return
				}
				if ( json.user === null ) {
					this.setState({loggedIn: false})
					return
				}
				json.didPing = true
				json.loggedIn = true
				this.setState(json)
				this.channels()
					.then(this.groups())
					.then(this.raidbotAuth())
					.then(this.users())
					.then(this.save())
			}.bind(this))
			.catch(function(ex) {
				this.setState({
					didPing: false,
					loggedIn: false,
				})
				this.save()
			}.bind(this))
	}
}

export default Api

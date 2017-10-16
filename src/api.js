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
				visibility: this.visibilitySlack,
			},
			team: {
				host: this.raidHost,
				leave: this.raidLeave,
				join: this.raidJoin,
				ping: this.raidPing,
				close: this.raidClose,
			},
			user: {
				streams: {
					get: this.getUserStreams,
					set: this.setUserStream,
				},
				set: {
					xbl: this.setUserXbl,
				},
				meta: {
					get: this.getUserMeta,
					set: this.setUserMeta,
				},
			},
		}})
		setInterval(function(){
			this.ping()
		}.bind(this), 60000)
	}
	url = ( part ) => {
		return "//dashboard.fofgaming.com/api/v0/" + part
	}
	postJSON = ( what, payload ) => {
		if ( what.substring(0, 2) !== "//" ) {
			what = this.url( what );
		}
		return fetch(
			what,
			{
				credentials: "include",
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload)
			})
	}
	putJSON = ( what, payload ) => {
		if ( what.substring(0, 2) !== "//" ) {
			what = this.url( what );
		}
		return fetch(
			what,
			{
				credentials: "include",
				method: "PUT",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload)
			})
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
				this.setState({lastRaidFetch: new Date().getTime()})
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
				this.setState({lastChannelsFetch: new Date().getTime()})
			}.bind(this))
	}
	raidbotAuth = () => {
		return this.fetch("auth/team-tool")
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({raidbotToken: "fof-ut " + json})
			}.bind(this))
	}
	groups = () => {
		return this.fetch("groups")
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({groupList: json})
				this.setState({lastGroupsFetch: new Date().getTime()})
			}.bind(this))
	}
	joinSlack = (id, kind) => {
		console.log("join " + id + " " + kind)
		var op = null
		if ( kind === "channel" ) {
			op = this.fetch("channels/"+id+"/join")
		} else {
			op = this.fetch("groups/"+id+"/join")
		}
		op.then(this.ping)
	}
	partSlack = (id, kind) => {
		var op = null
		if ( kind === "channel" ) {
			op = this.fetch("channels/"+id+"/leave")
		} else {
			op = this.fetch("groups/"+id+"/leave")
		}
		op.then(this.ping)
	}
	visibilitySlack = (id, set) => {
		return this.putJSON(
			"groups/"+id+"/visibility",
			{ visible: set }
		).then(this.ping)
	}
	getUserStreams = (userid) => {
		return this.fetch("streams/" + userid)
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				var m = this.state.meta
				m.streams[userid] = json
				this.setState({meta: m})
			}.bind(this))
	}
	setUserStream = (userID, kind, value) => {
		return this.postJSON("streams", {kind: kind, id: value, userID: userID})
	}
	setUserXbl = (userID, value) => {
		return this.postJSON("member/" + userID, {xbl: value})
	}
	getUserMeta = (userid) => {
		return this.fetch("meta/member/" + userid)
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				var m = this.state.meta
				m.users[userid] = json
				this.setState({meta: m})
			}.bind(this))
	}
	setUserMeta = (userid, key, value) => {
	}
	ping = () => {
		this.raidbotAuth()
			.then(function() {
				this.setState({loggedIn: true})
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
						// json.admin = false // testing
						json.didPing = true
						json.loggedIn = true
						this.setState(json)
						this.setState({lastPingFetch: new Date().getTime()})
						this.raidList()
							.then(this.users)
							.then(this.groups)
							.then(this.channels)
							.then(this.save)
					}.bind(this))
					.catch(function(ex) {
						this.setState({
							didPing: false,
							loggedIn: false,
						})
						this.save()
					}.bind(this)
					)
			}.bind(this)
			)
	}
}

export default Api

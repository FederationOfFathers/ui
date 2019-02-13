import 'whatwg-fetch'
import State from './state.js'

class Api extends State {
	apiComponentWillMount = () => {
		this.setState({
			api: {
				raw: {
					fetch: this.fetch,
				},
				slack: {
					join: this.joinSlack,
					part: this.partSlack,
					visibility: this.visibilitySlack,
				},
				stats: {
					hourly: this.statsHourly,
					daily: this.statsDaily,
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
			}
		})
		this.ping()
		setInterval(function(){
			this.ping()
		}.bind(this), 180000)
	}
	url = ( part, version = "v0" ) => {
		return "//dashboard.fofgaming.com/api/" + version + "/" + part
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
	fetch = ( what, version ) => {
		if ( what.substring(0, 2) !== "//" ) {
			what = this.url( what, version );
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
			}.bind(this)).catch((error) => {
				console.error("Cannot get raids. " + error);
			})
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
			}.bind(this)).catch(function(err) {
				console.error("Could not fetch users - " + err )
			})
	}
	members = async () => {
		try {
			let response = await this.fetch("members", "v1");
			let json = await response.json();
			this.setState({members: json});
		} catch(error) {
			console.error("Unable to get members." + error);
		}
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
	raidbotAuth = async () => {
		try {

			let response = await this.fetch("auth/team-tool", "v1")
			let json = await response.json();
			if ( typeof json === "string" && json !== "" ) {
				this.setState({raidbotToken: "fof-ut " + json})
			} else {
				this.setState({checkedAuth: true, raidbotToken: false})
			}
		} catch(error) {
			console.error("unable to get raid data" + error)
			this.setState({raidbotToken: false});
		}
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
		var op = null
		if ( kind === "channel" ) {
			op = this.fetch("channels/"+id+"/join")
		} else {
			op = this.fetch("groups/"+id+"/join")
		}
		return op.then(this.ping)
	}
	statsDaily = (userID, statID, last) => {
		return this.fetch("xhr/stats/v1/daily.json?stats=" + statID + "&last=" + last + "&users=" + userID)
			.then(function(response) {
				return response.json()
			}).catch(function(err) {
				console.error("Could not fetch daily stats - " + err)
				return {}
			})
	}
	statsHourly = (userID, statID, last) => {
		return this.fetch("xhr/stats/v1/hourly.json?stats=" + statID + "&last=" + last + "&users=" + userID)
			.then(function(response) {
				return response.json()
			})
	}
	partSlack = (id, kind) => {
		var op = null
		if ( kind === "channel" ) {
			op = this.fetch("channels/"+id+"/leave")
		} else {
			op = this.fetch("groups/"+id+"/leave")
		}
		return op.then(this.ping)
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
		var put = {}
		put[key]=value
		return this.putJSON("meta/member/" + userid, put)
	}
	ping = () => {
		this.raidbotAuth()
			.then(function() {
				if ( this.state.raidbotToken === false ) {
					this.setState({checkedAuth: true, loggedIn: false})
					return
				}
				this.fetch( "ping" )
					.then(function(response) {
						return response.json()
					})
					.then(function(json) {
						this.setState({checkedAuth: true})
						if ( typeof json.user === "undefined" ) {
							this.setState({loggedIn: false})
							return
						}
						if ( json.user === null ) {
							this.setState({loggedIn: false})
							return
						}
						this.setState({loggedIn: true})
						// json.admin = false // testing
						json.didPing = true
						json.loggedIn = true
						this.setState(json)
						this.setState({lastPingFetch: new Date().getTime()})
						this.raidList()
							.then(this.users)
							.then(this.members)
							.then(this.groups)
							.then(this.channels)
							.then(this.save)
					}.bind(this))
					.catch(function(ex) {
						this.setState({
							didPing: false,
							loggedIn: false,
						})
					}.bind(this)
					)
			}.bind(this)
			).catch(function(error) {
				console.error(error);
			})
	}
}

export default Api

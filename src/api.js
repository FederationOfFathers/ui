import 'whatwg-fetch'
import State from './state.js'

class Api extends State {
	apiComponentWillMount = () => {
		this.setState({
			api: {
				raw: {
					fetch: this.fetch,
				},
				stats: {
					hourly: this.statsHourly,
					daily: this.statsDaily,
				},
				team: {
					host: this.eventCreate,
					leave: this.eventLeave,
					join: this.eventJoin,
					ping: this.raidPing,
					close: this.eventDelete,
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
		this.loadOAuth();
		this.ping()
		setInterval(function(){
			this.ping()
		}.bind(this), 180000)
	}

	url = ( part, version = "v1" ) => {
		// return "//dashboard.fofgaming.com/api/" + version + "/" + part
		return "//localhost:8866/api/" + version + "/" + part
	}
	postJSON = ( what, payload, version ) => {
		if ( what.substring(0, 2) !== "//" ) {
			what = this.url( what, version );
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
	putJSON = ( what, payload, version ) => {
		if ( what.substring(0, 2) !== "//" ) {
			what = this.url( what, version );
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
			}, version)
	}
	deleteJSON = ( what, payload, version ) => {
		if ( what.substring(0, 2) !== "//" ) {
			what = this.url( what, version );
		}
		return fetch(
			what,
			{
				credentials: "include",
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload)
			}, version)
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
	eventsList = async () => {
		try {
			let response = await this.fetch("events", "v1");
			let json = await response.json();
			this.setState({events: json, eventsLastFetched: new Date().getTime()})
		} catch(error) {
			console.error("Cannot get events. " + error);
		}
	}
	eventJoin = async ( eventID,  type = 1) => {
		try {
			let body = { eventID: eventID, type: type };
			await this.postJSON( 'events/' + eventID + '/join', body, "v1");
			await this.eventsList();
		} catch(error) {
			console.error("unable to join event " + error)
		}
	}
	eventCreate = async ( body ) => {
		try {
			await this.postJSON( 'events/create', body, "v1");
			await this.eventsList();
		} catch(error) {
			console.error("unable to create event " + error)
		}
	}
	eventDelete = async ( eventID ) => {
		try {
			await this.deleteJSON( 'events/' + eventID, {}, "v1");
			await this.eventsList();
		} catch(error) {
			console.error("unable to create event " + error)
		}
	}
	eventLeave = async ( eventID,  eMemberID) => {
		try {
			let body = { eventID: eventID, member: eMemberID};
			await this.postJSON( 'events/leave', body, "v1");
			await this.eventsList();
		} catch(error) {
			console.error("unable to leave event " + error)
		}
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
		return this.fetch("xhr/users/v1/users.json", "v0") // TODO bump API to v1
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
	channels = async () => {
		try {
			let response = await this.fetch("events/channels", "v1");
			let json = await response.json();
			
			this.setState({
				eventChannels: json,
				lastEventChannelsFetch: new Date().getTime()
			})
			
		} catch(error) {
			console.error("unable to load event channels " +  error)
		}
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
	ping = async () => {
		try {
			let pingResponse = await this.fetch("ping");
			let pingJson = await pingResponse.json();
			if (typeof pingJson.user === "undefined" || pingJson.user == null) {
				this.setState({
					loggedIn: false,
				})
			} else {
				this.setState({loggedIn: true})
			}

			pingJson.didPing = true;
			pingJson.loggedIn = true;
			this.setState({pingJson});
			this.setState({lastPingFetch: new Date().getTime()});
		} catch (error) {
			console.error("ping failed: " + error)
			this.setState({
				didPing: false,
				loggedIn: false,
			})
		}

		try {
			await this.eventsList()
			await this.users()
			await this.members()
			await this.groups()
			await this.channels()
			await this.save()

		} catch(error) {
			console.warn("unable to fetch some data " + error)
		}
	}
	loadOAuth = async () => {
		let link = "";
		try {
			let response = await this.fetch("oauth/discord", "v1");
			link = await response.json();
		} catch (error) {
			console.error("Could not get oauth." + error)
		}
		this.setState({oauth: {
			discord: link,
		}});
	}
}

export default Api

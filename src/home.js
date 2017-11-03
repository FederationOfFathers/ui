import React, { Component } from 'react';

var homeStats = {
	games: null,
	stats: null,
}

class Home extends Component {
	componentWillMount = () => {
		var games = false
		var stats = false
		if ( homeStats.games !== null ) {
			games = homeStats.games
		}
		if ( homeStats.stats !== null ) {
			stats = homeStats.stats
		}
		this.setState({
			days: 7,
			topChannels: 6,
			topGames: 10,
			fetching: false,
			games: games,
			stats: stats
		})
	}

	fetch = () => {
		if ( this.state.fetching === false ) {
			this.pullSlackActivity()
			.then(this.pullGameActivity)
		}
	}

	componentDidMount = () => {
		this.fetch()
	}

	componentDidUpdate = () => {
		this.fetch()
	}

	pullGameActivity = () => {
		this.setState({fetching: "games"})
		return this.props.state.api.raw.fetch('games/played/top/'+this.state.days+'/'+this.state.topGames+'.json')
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				var max = 0;
				for ( var i=0; i<json.length; i++ ) {
					if ( json[i].players > max ) {
						max = json[i].players
					}
				}
				for ( i=0; i<json.length; i++ ) {
					json[i].pct = Math.round((json[i].players / max) * 100)
				}
				homeStats.games = json
				this.setState({
					games: json,
				})
			}.bind(this))
	}

	pullSlackActivity = () => {
		this.setState({fetching: "stats"})
		return this.props.state.api.raw.fetch('xhr/stats/v1/slack/activity/last-' + this.state.days + '.json')
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				var data = []
				var channels = Object.keys(json)
				var max = 0
				for ( var channel in channels ) {
					var days = Object.keys(json[channels[channel]])
					var sum = 0
					for ( var day in days ) {
						sum += json[channels[channel]][days[day]]
					}
					if ( sum > max ) {
						max = sum
					}
					data.push({name: channels[channel], v: sum})
				}
				data.sort(function(a, b) {
					if (a.v < b.v) {
						return -1
					}
					if (a.v > b.v) {
						return 1
					}
					return 0
				})
				var final = []
				for ( var i=0; i<this.state.topChannels; i++ ) {
					final.push(data.pop())
					final[i].pct = Math.round((final[i].v / max) * 100)
				}
				homeStats.stats = final
				this.setState({stats: final})
			}.bind(this))
	}

	games = () => {
		if ( this.state.games === false ) {
			return null
		}
		var rval = []
		for ( var i in this.state.games ) {
			rval.push((
				<div key={i} className="d-flex flex-row">
					<div
						className="text-nowrap w-75 mw-75 text-truncate"
						style={{
							paddingTop: "0.25em",
							marginBottom: "0.1em",
							height: "2em",
							textOverflow: "ellipsis",
							paddingLeft: "1em",
							borderRadius: "0.5em",
							backgroundImage: "-webkit-linear-gradient(left, #157EFB, #157EFB " + ( this.state.games[i].pct - 10 ) + "%, transparent "+this.state.games[i].pct+"%, transparent 100%)",
					}}>
						{this.state.games[i].name}
					</div>
					<div className="w-25 text-center">{this.state.games[i].players.toLocaleString()}</div>
				</div>
			))
		}
		return (
			<div>
				<div className="d-flex flex-row">
					<div className="w-75"><strong>Most PLayed Games</strong></div>
					<div className="w-25 text-center"><strong>Players</strong></div>
				</div>
				{rval}
			</div>
		)
	}
	slack = () => {
		if ( this.state.stats === false ) {
			return null
		}
		var rval = []
		for ( var i in this.state.stats ) {
			rval.push((
				<div key={i} className="d-flex flex-row">
					<div
							className="text-nowrap w-75 mw-75 text-truncate"
							style={{
							paddingTop: "0.25em",
							marginBottom: "0.1em",
							height: "2em",
								maxHeight: "2em",
								textOverflow: "ellipsis",
								paddingLeft: "1em",
								borderRadius: "0.5em",
								backgroundImage: "-webkit-linear-gradient(left, #157EFB, #157EFB " + ( this.state.stats[i].pct - 10 ) + "%, transparent "+this.state.stats[i].pct+"%, transparent 100%)",
						}}>
							{this.state.stats[i].name}
						</div>
					<div className="w-25 text-center">{this.state.stats[i].v.toLocaleString()}</div>
				</div>
			))
		}
		return (
			<div>
				<div className="d-flex flex-row">
					<div className="w-75"><strong>Most Active Channels</strong></div>
					<div className="w-25 text-center"><strong>Msgs</strong></div>
				</div>
				{rval}
			</div>
		)
	}
	longer = () => {
		var newDays = this.state.days
		switch( newDays ) {
			default:
				break
			case 7:
				newDays = 14
				break;
			case 14:
				newDays = 30
				break;
			case 30:
				newDays = 60
				break;
			case 60:
				newDays = 90
				break;
		}
		this.setState({days: newDays, fetching: false})
	}
	shorter = () => {
		var newDays = this.state.days
		switch( newDays ) {
			default:
				break
			case 14:
				newDays = 7
				break;
			case 30:
				newDays = 14
				break;
			case 60:
				newDays = 30
				break;
			case 90:
				newDays = 60
				break;
		}
		this.setState({days: newDays, fetching: false})
	}
	render = () => {
		return (
			<div>
				<form>
				<div className="form-group clearfix">
					<button style={{marginLeft: "12.5%" }} className="btn-sm btn-primary float-left w-25 btn" onClick={this.shorter}>fewer</button>
					<input disabled className="mx-1 form-control-sm text-center float-left w-25 m-0 form-text form-control" value={this.state.days+" days"} type="text"/>
					<button className="btn-sm btn-primary float-left w-25 btn" onClick={this.longer}>more</button>
				</div>
				</form>
				{this.slack()}
				{this.games()}
			</div>
		)
	}
}

export default Home

import React, { Component } from 'react';
import dpr from './lib/dpr'

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
			topChannels: 6,
			topGames: 8,
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
		return this.props.state.api.raw.fetch('games/played/top/'+this.props.state.days+'/'+this.state.topGames+'.json')
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
		return this.props.state.api.raw.fetch('xhr/stats/v1/slack/activity/last-' + this.props.state.days + '.json')
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
		var zoom = dpr()
		var rval = []
		for ( var i in this.state.games ) {
			var img = null
			if ( this.state.games[i].image !== "" ) {
				img = (<img style={{height: "32px", width: "32px"}} className="float-right" src={"//i"+(i%3)+".wp.com/dashboard.fofgaming.com" + this.state.games[i].image+ "?h=32&w=32&zoom=" + zoom} alt="" game-id={this.state.games[i].id}/>)
			}
			rval.push((
				<div key={this.state.games[i].name} className="d-flex flex-row" game-id={this.state.games[i].id}
					onClick={(e) =>{
						this.props.state.hasher.replace({
							main: "game",
							id: e.target.getAttribute("game-id"),
						})
					}}>
					<div
						game-id={this.state.games[i].id}
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
					<div className="w-25 text-left clearfix" game-id={this.state.games[i].id}>
						<div className="float-left py-1" game-id={this.state.games[i].id}>{this.state.games[i].players.toLocaleString()}</div>
						&nbsp;
						{img}
					</div>
				</div>
			))
		}
		return (
			<div>
				<div className="d-flex flex-row">
					<div className="w-75"><strong>Most Played Games</strong></div>
					<div className="w-25 text-left"><strong>Players</strong></div>
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
					<div className="w-25 text-left py-1">{this.state.stats[i].v.toLocaleString()}</div>
				</div>
			))
		}
		return (
			<div>
				<div className="d-flex flex-row">
					<div className="w-75"><strong>Most Active Channels</strong></div>
					<div className="w-25 text-left"><strong>Msgs</strong></div>
				</div>
				{rval}
			</div>
		)
	}
	render = () => {
		return (
			<div>
				{this.slack()}
				{this.games()}
			</div>
		)
	}
}

export default Home

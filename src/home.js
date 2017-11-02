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
				<div key={i} className="float-left w-50 my-1 mx-0 py-0 px-1">
					<span style={{fontSize: "0.75em"}}>{this.state.games[i].name}</span>
					<div className="progress">
						<div className="progress-bar" style={{
							width: this.state.games[i].pct + "%",
							overflow: "elipses",
						}}role="progressbar">
						{this.state.games[i].players.toLocaleString()}
					</div>
				</div>
			</div>
			))
		}
		return (
			<div className="clearfix">
				<div className="text-center">
					<h6>Most active games</h6>
					<h6>Over the last {this.state.days} days</h6>
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
				<div key={i} className="float-left w-50 my-1 mx-0 py-0 px-1">
					<span style={{fontSize: "0.75em"}}>{this.state.stats[i].name}</span>
					<div className="progress">
						<div className="progress-bar" style={{
							width: this.state.stats[i].pct + "%",
							overflow: "elipses",
						}}role="progressbar">
						{this.state.stats[i].v.toLocaleString()}
					</div>
				</div>
			</div>
			))
		}
		return (
			<div className="clearfix">
				<div className="text-center">
					<h6>Most active channels</h6>
					<h6>Over the last {this.state.days} days</h6>
				</div>
				{rval}
			</div>
		)
	}
	render = () => {
		return (
			<div>
				{this.slack()}
				<br/>
				{this.games()}
			</div>
		)
	}
}

export default Home

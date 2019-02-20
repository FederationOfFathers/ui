import React, { Component } from 'react';
import dpr from './lib/dpr'

var homeStats = {
	games: null,
	stats: null,
}

class Home extends Component {
	componentWillMount = () => {
		var games = {}
		var stats = {}
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
			this.pullGameActivity()
		}
	}

	componentDidMount = () => {
		this.fetch()
	}

	componentDidUpdate = () => {
		this.fetch()
	}

	pullGameActivity = async () => {
		this.setState({fetching: "games"})
		try {
			var response = await this.props.state.api.raw.fetch('games/played/top/'+this.props.state.days+'/'+this.state.topGames+'.json');
			var json = {}
			if (response.ok) {
				json = await response.json();
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
			} else {
				window.Rollbar.warning('Unable to load Game data', 'warning', { status: response.status, statusText: response.statusText });
				json["error"] = {
					name: "Game data unavailable",
					id: "error",
					pct: 0,
					players: "",
				}
			}
			
			this.setState({
				games: json,
			})
		} catch(err) {
			console.error("Unable to pull game activity - " + err )
		}
	}


	games = () => {
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
	render = () => {
		return (
			<div>
				{this.games()}
			</div>
		)
	}
}

export default Home

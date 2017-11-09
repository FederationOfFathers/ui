import React, { Component } from 'react';
import Moment from 'moment-timezone'
import dpr from './lib/dpr'

var gameCache = {}

class Game extends Component {
	componentWillMount = () => {
		var data = false
		if ( typeof gameCache[this.props.state.vars.id] !== "undefined" ) {
			data = gameCache[this.props.state.vars.id]
		}
		this.setState({
			tz: Moment.tz.guess(),
			gameID: false,
			data: data,
		})
	}
	componentDidMount = () => {
		this.componentDidUpdate()
	}
	componentDidUpdate = () => {
		if ( this.state.gameID === this.props.state.vars.id ) {
			return
		}
		this.setState({
			data: false,
			gameID: this.props.state.vars.id,
		})
		this.fetch()
	}
	fetch = () => {
		this.props.state.api.raw.fetch('games/played/' + this.props.state.vars.id + '/' + this.props.state.days + '.json')
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				gameCache[this.props.state.vars.id] = json
				this.setState({data: json})
			}.bind(this))
	}
	list = () => {
		if ( this.state.data === false ) {
			return null
		}
		var w = document.querySelector('#game').offsetWidth
		var zoom = dpr()
		var rval = []
		var members = []
		rval.push((
			<div className="card" key="header">
				<img
					className="card-img-top"
					style={{width: w + "px", height: w + "px"}}
					src={"//i0.wp.com/dashboard.fofgaming.com/api/v0/cdn/" + this.state.data.game.image + "?w="+w+"&zoom=" + zoom }
					alt={this.state.data.game.name}/>
			</div>
		))
		for ( var i in this.state.data.players ) {
			var player = this.props.state.users[this.state.data.players[i].slack_id]
			members.push((
				<a key={i} className="my-1" style={{width: "49%", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}
					onClick={(e) => {
						console.log({
							main: "members",
							member: e.target.getAttribute("player"),
						})
						this.props.state.hasher.replace({
							main: "members",
							member: e.target.getAttribute("player"),
						})
					}}
					player={player.User.Name}>
					<img src={player.User.Thumb} className="mx-1" alt="" player={player.User.Name}/>
					{player.User.DisplayName}
				</a>
			))
		}
		rval.push((
			<div key="members" className="d-flex justify-content-around flex-wrap">
				{members}
			</div>
		))
		return rval
	}
	render = () => {
		return (
			<div id="game">
				{this.list()}
			</div>
		)
	}
}

export default Game

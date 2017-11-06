import React, { Component } from 'react';

var gamesCache = {}

class Games extends Component {
	componentWillMount = () => {
		var data = false
		if ( typeof gamesCache[this.props.member.ID] !== "undefined" ) {
			data = gamesCache[this.props.member.ID]
		}
		this.setState({
			user: false,
			open: false,
			fetching: false,
			days: 90,
			data: data,
		})
	}
	componentDidUpdate = () => {
		if ( this.state.user === this.props.member.ID ) {
			return
		}
		console.log("here")
		console.log(this)
		this.fetch()
		var data = false
		if ( typeof gamesCache[this.props.member.ID] !== "undefined" ) {
			data = gamesCache[this.props.member.ID]
		}
		this.setState({
			data: data,
			fetching: false,
			user: this.props.member.ID,
		})
	}
	fetch = () => {
		this.setState({fetching: this.props.member.ID})
		this.props.state.api.raw.fetch('games/player/' + this.props.member.ID + '/' + this.state.days + '.json')
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				gamesCache[this.props.member.ID] = json
				this.setState({data: json})
			}.bind(this))
	}
	list = () => {
		if ( this.state.data === false ) {
			return null
		}
		if ( this.state.open === false ) {
			return null
		}
		var rval = []
		for ( var i in this.state.data ) {
			var game = this.state.data[i]
			rval.push((
				<div key={i} className="card clearfix my-2">
					<img style={{minHeight: "200px"}} className="card-img-top" src={"//i0.wp.com/dashboard.fofgaming.com/api/v0/cdn/" + game.image } alt={game.name}/>
				</div>
			))
		}
		return rval
	}
	click = () => {
		if ( this.state.open === true ) {
			this.setState({open: false})
			return
		}
		this.setState({open: true})
	}
	render = () => {
		var openClose = this.state.open ? "▲" : "▼"
		return (
			<div>
				<a onClick={this.click} className="text-light my-1 w-100 btn btn-primary">
					<span style={{fontSize: '0.8em', marginTop: ".25em"}} className="float-right text-dark">{openClose}</span>
					Recently Played Games
				</a>
				{this.list()}
			</div>
		)
	}
}

export default Games

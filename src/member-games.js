import React, { Component } from 'react';
import dpr from './lib/dpr'
import LazyLoad from 'react-lazy-load'

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
			data: data,
		})
	}
	componentDidUpdate = () => {
		if ( this.state.user === this.props.member.ID ) {
			return
		}
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
		this.props.state.api.raw.fetch('games/player/' + this.props.member.ID + '/' + this.props.state.days + '.json')
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				gamesCache[this.props.member.ID] = json
				this.setState({data: json})
			}.bind(this)).catch(function(err){
				console.error("Unable to get player games. " + err)
			})
	}
	list = () => {
		if ( this.state.data === false ) {
			return null
		}
		if ( this.state.open === false ) {
			return null
		}
		var rval = []
		var dprVal = dpr()
		var totalW = document.querySelector('#members').offsetWidth
		var w = Math.floor(totalW/3)
		var brick = []
		for ( var i in this.state.data ) {
			var game = this.state.data[i]
			brick.push((
				<img key={i} style={{width: w + "px", height: w + "px"}} className="card-img-top"
					src={"//i"+(i%3)+".wp.com/dashboard.fofgaming.com/api/v0/cdn/" + game.image + "?w="+w+"&zoom=" + dprVal }
					alt={game.name}
					game-name={game.name}
					game-id={game.id}
					onClick={(e) => {
						this.props.state.hasher.replace({
							main: "game",
							id: e.target.getAttribute("game-id"),
						})
					}}
				/>
			))
			if ( (i+1)%3 === 0 ) {
				rval.push((<LazyLoad key={i} offset={w*1.5} height={w}><div>{brick}</div></LazyLoad>))
				brick = []
			}
		}
		if ( brick.length > 0 ) {
			rval.push((<LazyLoad key="last-brick" offset={w*1.5} height={w}><div>{brick}</div></LazyLoad>))
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
			<div id="members">
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

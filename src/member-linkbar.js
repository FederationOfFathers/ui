import React, { Component } from 'react';
import Xbox from './member-xbox'
import Mixer from './member-mixer'
import Twitch from './member-twitch'

class LinkBar extends Component {
	user = () => {
		return this.props.state.users[this.props.state.user.id].User
	}
	streams = () => {
		if ( typeof this.props.state.meta.streams[this.props.member.ID] === "undefined" ) {
			return { Twitch: "", Beam: "" }
		}
		return this.props.state.meta.streams[this.props.member.ID]
	}
	componentWillMount = () => {
		this.setState({
			id: this.props.member.ID,
			editing: false,
			xbl: this.user().GamerTag,
			twitch: this.streams().Twitch,
			mixer: this.streams().Beam,
			setFor: false,
		})
	}
	componentWillReceiveProps = ( p ) => {
		if ( this.state.id !== p.member.ID ) {
			this.setState({
				id: p.member.ID,
				editing: false,
				xbl: "",
				twitch: "",
				mixer: "",
				setFor: false,
			})
		}
	}
	componentDidUpdate = () => {
		if ( this.state.setFor === false ) {
			this.setState({setFor: this.props.member.ID})
			if ( this.state.mixer === "" || this.state.twitch === "" ) {
				var s = this.streams()
				if ( s.Beam !== "" || s.Twitch !== "" ) {
					this.setState({mixer: s.Beam, twitch: s.Twitch})
				}
			}
		}
	}

	saveTwitch = () => {
		this.props.state.api.user.streams.set(this.props.member.ID, "twitch", this.state.twitch)
			.then(function() {
				this.setState({editing: false})
			}.bind(this))
	}
	changeTwitch = (e) => {
		this.setState({twitch: e.target.value})
	}
	editTwitch = () => {
		return (
			<div className="input-group my-2">
				<span className="input-group-addon">twitch</span>
				<input onChange={this.changeTwitch} type="text" className="form-control" value={this.state.twitch}/>
				<span className="input-group-btn">
					<button onClick={this.saveTwitch} type="button" className="btn btn-primary">save</button>
				</span>
			</div>
		)
	}

	saveMixer = () => {
		this.props.state.api.user.streams.set(this.props.member.ID, "beam", this.state.mixer)
			.then(function() {
				this.setState({editing: false})
			}.bind(this))
	}
	changeMixer = (e) => {
		this.setState({mixer: e.target.value})
	}
	editMixer = () => {
		return (
			<div className="input-group my-2">
				<span className="input-group-addon">mixer</span>
				<input onChange={this.changeMixer} type="text" className="form-control" value={this.state.mixer}/>
				<span className="input-group-btn">
					<button onClick={this.saveMixer} type="button" className="btn btn-primary">save</button>
				</span>
			</div>
		)
	}

	saveXbox = () => {
		// As of this writing it can take 10 minutes or more for caches to clear and new
		// data to appear in the users.json response.
		this.props.state.api.user.set.xbl(this.props.member.ID, this.state.xbl)
			.then(function() {
				this.setState({editing: false})
			}.bind(this))
	}
	changeXbox = (e) => {
		this.setState({xbl: e.target.value})
	}
	editXbox = () => {
		return (
			<div className="input-group my-2">
				<span className="input-group-addon">xbl</span>
				<input onChange={this.changeXbox} type="text" className="form-control" value={this.state.xbl}/>
				<span className="input-group-btn">
					<button onClick={this.saveXbox} type="button" className="btn btn-primary">save</button>
				</span>
			</div>
		)
	}

	edit = ( what ) => {
		this.setState({editing: what})
	}
	display = () => {
		var owner = this.props.member.Name === this.props.state.user.name
		var s = this.props.state.meta.streams[this.props.member.ID]
		var mixer = ""
		var twitch = ""
		if ( typeof s !== "undefined" ) {
			twitch = s.Twitch
			mixer = s.Beam
		}
		return(
			<div className="btn-group btn-group-justified w-100">
				<Xbox owner={owner} edit={this.edit} id={this.props.member.GamerTag} state={this.props.state}/>
				<Twitch owner={owner} edit={this.edit} id={twitch} state={this.props.state}/>
				<Mixer owner={owner} edit={this.edit} id={mixer} state={this.props.state}/>
			</div>
		)
	}
	render = () => {
		switch( this.state.editing ) {
			case "twitch":
				return this.editTwitch()
			case "mixer":
				return this.editMixer()
			case "xbox":
				return this.editXbox()
			default:
				return this.display()
		}
	}
}

export default LinkBar

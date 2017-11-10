import React, { Component } from 'react';
import Xbox from './member-xbox'
import Mixer from './member-mixer'
import Twitch from './member-twitch'
import Twitter from './member-twitter'
import Instagram from './member-instagram'
import Filter from './lib/sanitize-social-input'

class LinkBar extends Component {
	metaValue = ( key ) => {
		if ( typeof this.props.meta === "undefined" ) {
			return ""
		}
		if ( typeof this.props.meta[key] === "undefined" ) {
			return ""
		}
		return this.props.meta[key]
	}
	user = () => {
		return this.props.state.users[this.props.state.user.id].User
	}
	streams = () => {
		this.props.state.api.user.streams.get(this.props.member.ID)
			.then(() => {
				console.log("got")
				console.log(this.props.state.meta.streams[this.props.member.ID])
				this.setState({
					twitch: this.props.state.meta.streams[this.props.member.ID].Twitch,
					mixer: this.props.state.meta.streams[this.props.member.ID].Beam,
				})
			})
	}
	componentWillMount = () => {
		this.setState({
			id: this.props.member.ID,
			editing: false,
			xbl: this.user().GamerTag,
			twitch: "",
			mixer: "",
			twitter: '',
			instagram: '',
			setFor: false,
		})
	}
	componentWillReceiveProps = ( p ) => {
		if ( this.state.id !== p.member.ID ) {
			var twit = ""
			if ( typeof p.meta.twitter !== "undefined" ) {
				twit = p.meta.twitter
			}
			var gram = ""
			if ( typeof p.meta.instagram !== "undefined" ) {
				gram = p.meta.instagram
			}
			this.setState({
				id: p.member.ID,
				editing: false,
				xbl: "",
				twitter: twit,
				instagram: gram,
				setFor: false,
			})
		}
	}
	componentDidUpdate = () => {
		if ( this.state.setFor === false ) {
			this.setState({setFor: this.props.member.ID})
			if ( this.state.mixer === "" || this.state.twitch === "" ) {
				this.streams()
			}
		}
	}
	componentDidMount = () => {
		this.props.state.api.user.meta.get()
	}
	saveTwitch = () => {
		this.props.state.api.user.streams.set(this.props.member.ID, "twitch", this.state.twitch)
			.then(function() {
				this.setState({editing: false})
			}.bind(this))
	}
	changeTwitch = (e) => {
		this.setState({twitch: Filter.social(e.target.value)})
	}
	editTwitch = () => {
		return (
			<div className="input-group my-2">
				<span className="input-group-addon">twitch.com/</span>
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
		this.setState({mixer: Filter.social(e.target.value)})
	}
	editMixer = () => {
		return (
			<div className="input-group my-2">
				<span className="input-group-addon">mixer.com/</span>
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

	editTwitter = () => {
		return(
			<div className="input-group my-2">
				<span className="input-group-addon">twitter.com/</span>
				<input onChange={(e)=>{
					this.setState({
						twitter: Filter.social(e.target.value),
					})
				}} type="text" className="form-control" value={this.state.twitter}/>
				<span className="input-group-btn">
					<button onClick={()=>{
						this.props.state.api.user.meta.set(this.props.member.ID, "twitter", this.state.twitter)
							.then(() =>{
								this.props.state.api.user.meta.get(this.props.member.ID)
									.then(()=>{
										this.props.reloadMeta()
										this.setState({editing:false})
									})
							})
					}} type="button" className="btn btn-primary">save</button>
				</span>
			</div>
		)
	}

	editInstagram = () => {
		return(
			<div className="input-group my-2">
				<span className="input-group-addon">instagram.com/</span>
				<input onChange={(e)=>{
					this.setState({
						instagram: Filter.social(e.target.value),
					})
				}} type="text" className="form-control" value={this.state.instagram}/>
				<span className="input-group-btn">
					<button onClick={()=>{
						this.props.state.api.user.meta.set(this.props.member.ID, "instagram", this.state.instagram)
							.then(() =>{
								this.props.state.api.user.meta.get(this.props.member.ID)
									.then(()=>{
										this.props.reloadMeta()
										this.setState({editing:false})
									})
							})
					}} type="button" className="btn btn-primary">save</button>
				</span>
			</div>
		)
	}

	edit = ( what ) => {
		this.setState({
			editing: what,
			twitter: this.metaValue("twitter"),
			instagram: this.metaValue("instagram"),
		})
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
			<div>
				<div className="btn-group btn-group-justified w-100">
					<Xbox owner={owner} edit={this.edit} id={this.props.member.GamerTag} state={this.props.state}/>
					<Twitch owner={owner} edit={this.edit} id={twitch} state={this.props.state}/>
					<Mixer owner={owner} edit={this.edit} id={mixer} state={this.props.state}/>
				</div>
				<div className="btn-group btn-group-justified w-100">
					<Twitter owner={owner} edit={this.edit} id={this.metaValue("twitter")} state={this.props.state}/>
					<Instagram owner={owner} edit={this.edit} id={this.metaValue("instagram")} state={this.props.state}/>
				</div>
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
			case "twitter":
				return this.editTwitter()
			case "instagram":
				return this.editInstagram()
			default:
				return this.display()
		}
	}
}

export default LinkBar

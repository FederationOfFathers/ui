import React, { Component } from 'react';
import moment from 'moment-timezone';
import InputMoment from 'input-moment';
import '../input-moment.css'

class EventHost extends Component {
	constructor(props) {
		super(props)


		// 🤷🏽‍♂️ somethign about getting the time/dams
		var initialMoment = moment()
		var initialOffMinutes = initialMoment.get('minute') % 5
		if ( initialOffMinutes !== 0 ) {
			initialMoment.set( 'minute', initialMoment.get('minute') + ( 5 - initialOffMinutes ) )
		}
		var initialOffSeconds = initialMoment.get('second')
		initialMoment.set( 'second', initialMoment.get('minute') - initialOffSeconds )
		var maxDays = 14
		if ( this.props.state.admin === true ) {
			maxDays = 365
		}

		this.state = {
			title: "",
			channel: "",
			m: initialMoment,
			now: moment(initialMoment),
			max: moment().add(maxDays, 'days'),
			tz: moment.tz.zone(moment.tz.guess()).abbr(moment()),
			need: 0,
		}
	}
	changeChannel = ( e ) => {
		this.setState({channel: e.target.value})
	}
	changeTitle = ( e ) => {
		this.setState({title: e.target.value})
	}
	momentString = () => {
		return this.state.m.format('MM/DD hh:mma') + ' ' + this.state.tz
	}
	changeMoment = ( m ) => {
		this.setState({m: m})
	}
	save = async () => {
		var err = this.errors()
		if ( err.Moment !== false ) {
			return
		}
		var body = {
			where: this.state.channel,
			title: this.state.title,
			when: this.state.m.format('X'), // IMPORTANT Go uses Unix/Seconds, not milliseconds
		}
		
		if ( this.state.need > 0 ) {
			// we ask how many MORE members... but we want to record how many
			// total that we need... so add an additional slot for the host
			body.need = this.state.need + 1;
		}
		try {
			await this.props.state.api.team.host(body)
			this.props.state.hasher.set({event: null})
		} catch(error) {
			console.error("event save failed " + error)
		}
		
	}
	stateComponentWillMount = () => {
		this.change( moment() )
	}
	errors = () => {
		var rval = {
			Moment: false,
			MomentGood: false,
			Title: false,
			Chan: false,
		}
		if ( this.state.channel === "" ) {
			rval.Chan = (<div className="alert alert-danger">Pick a channel</div>)
		}
		if ( this.state.title.length < 5 ) {
			rval.Title = (<div className="alert alert-danger">Title must be more substantial</div>)
		}
		if ( this.state.now.isAfter( this.state.m ) ) {
			rval.Moment = (<div className="mx-4 alert alert-danger">Be <strong>after</strong> {moment().format('llll')}</div>)
		} else if ( this.state.m.isAfter( this.state.max ) ) {
			rval.Moment = (<div className="mx-4 alert alert-danger">Be <strong>before</strong> {this.state.max.format('llll')}</div>)
		} else {
			rval.MomentGood = (<div className="mx-4 alert alert-success">Event Time: [{this.momentString()}]</div>)
		}
		return rval
	}
	renderChanSelect = () => {
		var channels = [
			(<option key="none" value="">Select A Channel</option>)
		]
		for ( let i in this.props.state.eventChannels ) {
			let channel = this.props.state.eventChannels[i];
			let channelName = channel.categoryName + ": " + channel.name;
			channels.push(<option key={i} value={channel.channelID}>{channelName}</option>)
		}
		return(
			<div className="form-group">
				<form>
					<div className="my-2 mx-4">
						<select onChange={this.changeChannel} className="form-control" id="echan">
							{channels}
						</select>
					</div>
				</form>
			</div>
		)
	}
	renderTitleInput = () => {
		if ( this.state.channel === "" ) {
			return null
		}
		return(
			<div className="form-group">
				<form>
					<div className="my-2 mx-4">
						<input
							value={this.state.title}
							onChange={this.changeTitle}
							type="text" id="ename"
							className="form-control"
							placeholder="Example Event Name"/>
					</div>
				</form>
			</div>
		)
	}

	renderMomentSelect = () => {
		if ( this.state.title.length < 5 ) {
			return null
		}
		var err = this.errors()
		return(
			<div className="form-group">
				<form>
					<div className="my-2">
						{ err.MomentGood || err.Moment }
						<div style={{textAlign: "center"}}>
							<InputMoment
								moment={this.state.m}
								onChange={this.changeMoment}
								onSave={this.save}
								minStep={5}
							/>
						</div>
					</div>
				</form>
			</div>
		)
	}

	decrNeed = () => {
		this.setState({need: this.state.need - 1})
	}

	decrNeedBtn = () => {
		return (<button type="button" className="btn btn-link border-1" onClick={this.decrNeed}>-</button>)
	}

	incrNeed = () => {
		this.setState({need: this.state.need + 1})
	}

	incrNeedBtn = () => {
		return (<button type="button" className="btn btn-link border-1" onClick={this.incrNeed}>+</button>)
	}

	renderNeedInput = () => {
		if ( this.state.title.length < 5 ) {
			return
		}
		if ( this.state.need < 1 ) {
			return (
				<div className="form-group">
					<form>
						<div className="my-2 mx-4 text-center">
							<input type="text" onClick={this.incrNeed} value="" className="form-control w-100" placeholder="How many players do you need?"/>
						</div>
					</form>
				</div>
			)
		}
		return(
			<div className="form-group">
				<form>
					<div className="my-2 mx-4 text-center border">
						looking for {this.decrNeedBtn()} {this.state.need} {this.incrNeedBtn()} more
					</div>
				</form>
			</div>
		)
	}

	render = () => {
		return (
			<div>
				{this.renderChanSelect()}
				{this.renderTitleInput()}
				{this.renderNeedInput()}
				{this.renderMomentSelect()}
			</div>
		)
	}
}

export default EventHost

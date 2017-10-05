import React, { Component } from 'react';
import moment from 'moment-timezone';
import InputMoment from 'input-moment';
import './input-moment.css'
class Host extends Component {
	componentWillMount = () => {
		var initialMoment = moment()
		var initialOffMinutes = initialMoment.get('minute') % 5
		if ( initialOffMinutes !== 0 ) {
			initialMoment.set( 'minute', initialMoment.get('minute') + ( 5 - initialOffMinutes ) )
		}
		var maxDays = 14
		if ( this.props.state.admin === true ) {
			maxDays = 365
		}
		this.setState({
			title: "",
			channel: "",
			m: initialMoment,
			now: moment(initialMoment),
			max: moment().add(maxDays, 'days'),
			tz: moment.tz.zone(moment.tz.guess()).abbr(moment()),
		})
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
	save = () => {
		console.log(this.state)
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
		for ( var cID in this.props.state.channels ) {
			channels.push(<option key={cID}>{this.props.state.channels[cID].name}</option>)
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

	render = () => {
		return (
			<div>
				{this.renderChanSelect()}
				{this.renderTitleInput()}
				{this.renderMomentSelect()}
			</div>
		)
	}
}

export default Host

import React, { Component } from 'react';
import Channel from './team-channel'
import ChannelButton from './team-channel-button'
import Host from './team-host'

class Team extends Component {
	channelButtons = () => {
		var rval = []
		var raids = this.props.state.raids.raids
		for ( var cName in raids ) {
			var cRaidKeys = Object.keys(raids[cName])
			if ( cRaidKeys.length < 1 ) {
				continue
			}
			rval.push((
				<ChannelButton key={cName} keys={cRaidKeys} name={cName} data={raids[cName]} state={this.props.state}/>
			))
		}
		return rval
	}
	channel = () => {
		var myChan = this.props.state.vars.chan
		if ( typeof myChan === "undefined" || myChan === "" ) {
			return null
		}
		var myRaids = this.props.state.raids.raids[myChan]
		if ( typeof myRaids === "undefined" ) {
			return null
		}
		var cRaidKeys = Object.keys(myRaids)
		if ( cRaidKeys.length < 1 ) {
			return null
		}
		return (
			<Channel key={myChan} keys={cRaidKeys} name={myChan} data={myRaids} state={this.props.state}/>
		)
	}
	host = () => {
		return (<Host state={this.props.state}/>)
	}
	render = () => {
		if ( this.props.state.navHeight < 1 ) {
			return(<div/>)
		}
		if ( this.props.state.vars.raid === "host" ) {
			return this.host()
		}
		return (
			<div className="team container container-fluid">
				<div className="row">
					<div className="col">
						<div className="btn-group-vertical w-100">{this.channelButtons()}</div>
					</div>
				</div>
				<div className="row">
					<div className="col">
						{this.channel()}
					</div>
				</div>
			</div>
		);
	}
}

export default Team

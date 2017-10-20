import React, { Component } from 'react';
import Nav from './nav'
import Team from './team'
import Roster from './roster-iframe'
import Channels from './channels'
import Members from './members'
import First from './first'

class LoggedIn extends Component {
	renderSection = () => {
		switch( this.props.state.vars.main ) {
			default:
				this.props.state.hasher.replace({main: "first"})
				return
			case "first":
				return (<First state={this.props.state}/>)
			case "team":
				return (<Team state={this.props.state}/>)
			case "roster":
				return (<Roster state={this.props.state}/>)
			case "channels":
				return (<Channels state={this.props.state}/>)
			case "members":
				return (<Members state={this.props.state}/>)
		}
	}
	render = () => {
		return (
			<div className="app">
				<Nav state={this.props.state}/>
				<div className="px-3 py-3"
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						height: this.props.state.windowHeight - this.props.state.navHeight,
						width: "100%",
						marginBottom: this.props.state.navHeight,
						overflow: "auto",
					}}>
					{this.renderSection()}
				</div>
			</div>
		);
	}
}

export default LoggedIn;

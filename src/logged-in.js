import React, { Component } from 'react';
import Nav from './nav'
import Team from './team'
import Roster from './roster-iframe'
import Channels from './channels'
import Members from './members'
import Home from './home'
import Game from './game'
import Menu from './menu'

class LoggedIn extends Component {
	renderSection = () => {
		switch( this.props.state.vars.main ) {
			default:
				this.props.state.hasher.replace({main: "home"})
				return
			case "menu":
				return (<Menu state={this.props.state}/>)
			case "home":
				return (<Home state={this.props.state}/>)
			case "team":
				return (<Team state={this.props.state}/>)
			case "roster":
				return (<Roster state={this.props.state}/>)
			case "channels":
				return (<Channels state={this.props.state}/>)
			case "members":
				return (<Members state={this.props.state}/>)
			case "game":
				return (<Game state={this.props.state}/>)
		}
	}
	render = () => {
		return (
			<div className="app">
				<Nav state={this.props.state}/>
					<div className="row py-3"
						style={{
							// position: "absolute",
							// top: 0,
							// left: 0,
							height: this.props.state.windowHeight - this.props.state.navHeight,
							// width: "100%",
							marginBottom: this.props.state.navHeight,
							overflow: "auto",
						}}>
					<div className="col-sm-12">
						{this.renderSection()}
					</div>
				</div>
			</div>
		);
	}
}

export default LoggedIn;

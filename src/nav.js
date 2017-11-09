import React, { Component } from 'react';
import TeamNav from './nav-team'

class NavLink extends Component {
	render() {
		var classes = "nav-link mx-1"
		if ( true === this.props.active ) {
			classes = classes + " active"
		}
		return(
			<li className="nav-item" style={{fontSize: "0.7em", maxWidth: "25%"}}>
				<a style={{cursor: "pointer"}} className={classes} onClick={this.props.nav}>{this.props.text}</a>
			</li>
		);
	}
}

class Nav extends Component {
	nav = ( to ) => {
		switch( to ) {
			case "members":
				return  function() { this.props.state.hasher.replace({main: to, member: this.props.state.user.name}) }.bind(this)
			default:
				return function() { this.props.state.hasher.replace({main: to}) }.bind(this)
		}
	}
	componentDidMount = () => {
		this.props.state.setNavHeight(
			document.getElementById("nav").offsetHeight
		)
	}
	componentDidUpdate = () => {
		var h = document.getElementById("nav").offsetHeight
		if ( this.props.state.navHeight !== h ) {
			this.props.state.setNavHeight(h)
		}
	}
	render() {
		var current = this.props.state.vars.main || false
		return (
			<div id="nav" style={{backgroundColor:"#fff"}} className="container container-fluid fixed-bottom px-1 py-2">
				<TeamNav state={this.props.state}/>
				<ul className="nav nav-pills nav-fill">
					<NavLink text="Home" active={"home" === current} nav={this.nav("first")}/>
					<NavLink text="Team" active={"team" === current} nav={this.nav("team")}/>
					{ /* <NavLink text="Roster" active={"roster" === current} nav={this.nav("roster")}/> */ }
					<NavLink text="Channels" active={"channels" === current} nav={this.nav("channels")}/>
					{ /* <NavLink text="Members" active={"members" === current} nav={this.nav("members")}/> */ }
					<NavLink text="Members" active={"members" === current} nav={this.nav("members")}/>
				</ul>
			</div>
		);
	}
}

export default Nav

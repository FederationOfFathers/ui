import React, { Component } from 'react';
import TeamNav from './nav-team'

class NavLink extends Component {
	render() {
		var classes = "nav-link mx-1"
		if ( true === this.props.active ) {
			classes = classes + " active"
		}
		var aStyle = {
			cursor: "pointer",
		}
		if ( "☰" === this.props.text ) {
			aStyle['paddingLeft'] = "0.25em"
			aStyle['paddingRight'] = "0.25em"
			aStyle['marginLeft'] = "0"
		}
		return(
			<li className="nav-item text-center" style={{fontSize: "0.7em", width: (this.props.width + "%"), maxWidth: (this.props.width + "%")}}>
				<a style={aStyle} className={classes} onClick={this.props.nav}>{this.props.text}</a>
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
					<NavLink text="☰" active={"menu" === current} nav={this.nav("menu")} width={8}/>
					<NavLink text="Home" active={"home" === current} nav={this.nav("first")} width={20}/>
					<NavLink text="Team" active={"team" === current} nav={this.nav("team")} width={20}/>
					<NavLink text="Channels" active={"channels" === current} nav={this.nav("channels")} width={26}/>
					<NavLink text="Members" active={"members" === current} nav={this.nav("members")} width={26}/>
				</ul>
			</div>
		);
	}
}

export default Nav

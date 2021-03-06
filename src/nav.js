import React, { Component } from 'react';
import TeamNav from './nav-team'

class NavLink extends Component {
	nav = () => {
		if ( "☰" === this.props.text && true === this.props.active ) {
			window.history.back()
			return
		}
		this.props.nav()
	}
	render() {
		var classes = "nav-link mx-1"
		if ( true === this.props.active ) {
			classes = classes + " active text-white font-weight-bold px-1"
		}
		var aStyle = {
			cursor: "pointer",
		}
		var txt = this.props.text
		if ( "☰" === this.props.text ) {
			if ( true === this.props.active ) {
				txt = "✖"
			}
			aStyle['paddingLeft'] = "0.25em"
			aStyle['paddingRight'] = "0.25em"
			aStyle['marginLeft'] = "0"
		}
		return(
			<li className="nav-item text-center" style={{fontSize: "0.7em", width: (this.props.width + "%"), maxWidth: (this.props.width + "%")}}>
				<a style={aStyle} className={classes} onClick={this.nav}>{txt}</a>
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
					
					<NavLink text="Events" active={"events" === current} nav={this.nav("events")} width={20}/>
					<NavLink text="Members" active={"members" === current} nav={this.nav("members")} width={26}/>
				</ul>
			</div>
		);
	}
}

export default Nav

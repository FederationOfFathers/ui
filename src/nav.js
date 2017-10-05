import React, { Component } from 'react';

class NavLink extends Component {
	render() {
		var classes = "nav-link mx-1"
		if ( true === this.props.active ) {
			classes = classes + " active"
		}
		return(
			<li className="nav-item">
				<a style={{cursor: "pointer"}} className={classes} onClick={this.props.nav}>{this.props.text}</a>
			</li>
		);
	}
}

class Nav extends Component {
	nav = ( to ) => {
		return function() { this.props.state.hasher.replace({main: to}) }.bind(this)
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
	teamNav = () => {
		var f = function() {
			if ( this.props.state.vars.raid !== "host" ) {
				this.props.state.hasher.set({raid: "host"})
			} else {
				this.props.state.hasher.set({raid: null})
			}
		}.bind(this)
		if ( this.props.state.vars.main !== "team" ) {
			return null
		}
		if ( this.props.state.vars.raid === "host" ) {
			return (
				<ul className="nav nav-pills nav-fill">
					<li className="nav-item px-1 my-1">
						<button onClick={f} className="btn btn-danger w-100">Cancel</button>
					</li>
				</ul>
			)
		}
		return (
			<ul className="nav nav-pills nav-fill">
				<li className="nav-item px-1 my-1">
					<button onClick={f} className="btn btn-success w-100">Host an Event</button>
				</li>
			</ul>
		)
	}
	render() {
		var current = this.props.state.vars.main || false
		return (
			<div id="nav" className="container container-fluid fixed-bottom px-1 py-2">
				{this.teamNav()}
				<ul className="nav nav-pills nav-fill">
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

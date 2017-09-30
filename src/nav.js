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
        render() {
                var current = this.props.state.vars.main || false
                return (
                        <div id="nav" className="container container-fluid fixed-bottom px-1 py-2">
                                <ul className="nav nav-pills nav-fill">
                                        <NavLink text="Team" active={"team" === current} nav={this.nav("team")}/>
                                        <NavLink text="Roster" active={"roster" === current} nav={this.nav("roster")}/>
                                        <NavLink text="Channels" active={"channels" === current} nav={this.nav("channels")}/>
                                        { /* <NavLink text="Members" active={"members" === current} nav={this.nav("members")}/> */ }
                                </ul>
                        </div>
                );
        }
}

export default Nav

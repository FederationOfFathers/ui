import React, { Component } from 'react';
import Nav from './nav'
import Team from './team-iframe'
import Roster from './roster-iframe'

class LoggedIn extends Component {
        renderSection = () => {
                switch( this.props.state.vars.main ) {
                        default:
                                this.props.state.hasher.replace({main: "team"})
                                return
                        case "team":
                                return (<Team state={this.props.state}/>)
                        case "roster":
                                return (<Roster state={this.props.state}/>)
                        case "channels":
                                return
                        case "members":
                                return
                }
        }
        render = () => {
                return (
                        <div className="app">
                                <Nav state={this.props.state}/>
                                {this.renderSection()}
                        </div>
                );
        }
}

export default LoggedIn;
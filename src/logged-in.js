import React, { Component } from 'react';
import Nav from './nav'
import Team from './team-iframe'
import Roster from './roster-iframe'
import Channels from './channels'
import Members from './members'

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
                                return (<Channels state={this.props.state}/>)
                        case "members":
                                return (<Members state={this.props.state}/>)
                }
        }
        render = () => {
                return (
                        <div className="app">
                                <Nav state={this.props.state}/>
                                <div
                                        style={{
                                            height: this.props.state.windowHeight - this.props.state.navHeight,
                                            overflow: "auto",
                                }}>
                                        {this.renderSection()}
                                </div>
                        </div>
                );
        }
}

export default LoggedIn;

import React, { Component } from 'react';
import Nav from './nav'
import Team from './team-iframe'

class LoggedIn extends Component {
        render() {
                return (
                        <div className="app">
                                <Nav state={this.props.state}/>
                                <Team state={this.props.state}/>
                        </div>
                );
        }
}

export default LoggedIn;

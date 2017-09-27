import React, { Component } from 'react';

class LoggedIn extends Component {
  render() {
    return (
      <div className="AppLoggedIn">
            Welcome, {this.props.state.user.real_name}!
      </div>
    );
  }
}

export default LoggedIn;

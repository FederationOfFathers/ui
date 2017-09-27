import React, { Component } from 'react';

class LoggedOut extends Component {
  render() {
    return (
      <div className="AppLoggedOut">
            <p>Please log in.</p>
            <p>Send a message of just "login" to @damnbot in slack. Click the link he replies with.</p>
      </div>
    );
  }
}

export default LoggedOut;

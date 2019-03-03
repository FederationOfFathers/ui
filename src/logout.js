import React, { Component } from 'react';

export default class Logout extends Component {
    handleClick = () => {
        document.cookie = "secure-cookie=;path=/;domain=fofgaming.com;expires=-1";
        localStorage.clear();
        window.location.reload(false)
    }
    render = () => {
        return (
            <button type="button" className="btn btn-light" onClick={this.handleClick}>Logout</button>
        )
    }

}

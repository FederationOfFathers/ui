import React, { Component } from 'react';

export default class Logout extends Component {
    handleClick = () => {
        document.cookie = "secure-cookie=;path=/;domain=fofgaming.com;expires=-1";
        window.location.reload(false)
    }
    render = () => {
        return (
            <button type="button" onClick={this.handleClick}>Logout</button>
        )
    }

}
import React, { Component } from 'react';

class Xbox extends Component {
	clickLink = () => {
		if ( this.props.id === "" ) {
			return
		}
		if ( this.props.owner === true ) {
			this.props.edit("xbox")
			return
		}
		window.location = "https://account.xbox.com/en-US/Profile?GamerTag="+this.props.id
	}
	render = () => {
		if ( this.props.id === "" ) {
			return null
		}
		return (
			<button onClick={this.clickLink} className="btn btn-success" style={{ display: "block", width:"34%"}}>xbox</button>
		)
	}
}

export default Xbox

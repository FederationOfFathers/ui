import React, { Component } from 'react';

class Xbox extends Component {
	clickLink = () => {
		if ( this.props.owner === true ) {
			this.props.edit("xbox")
			return
		}
		if ( this.props.id === "" ) {
			return
		}
		window.open("https://account.xbox.com/en-US/Profile?GamerTag="+this.props.id)
	}
	render = () => {
		var classes = "btn"
		if ( this.props.id === "" ) {
			classes = classes + " btn-disabled"
		} else {
			classes = classes + " btn-success"
		}
		return (
			<button onClick={this.clickLink} className={classes} style={{ display: "block", width:"34%"}}>xbox</button>
		)
	}
}

export default Xbox

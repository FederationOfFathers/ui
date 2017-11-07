import React, { Component } from 'react';

class Twitter extends Component {
	clickLink = () => {
		if ( this.props.owner === true ) {
			this.props.edit("twitter")
			return
		}
		if ( this.props.id === "" ) {
			return
		}
		window.location = "https://twitter.com/" + this.props.id
	}
	render = () => {
		var classes = "btn"
		var style = {
			width: "50%",
		}
		if ( this.props.id === "" ) {
			classes = classes + " btn-disabled"
		} else {
			style.color = "white"
			style.backgroundColor = "#2AA3EF"
		}
		return(
			<button onClick={this.clickLink} className={classes} style={style}>Twitter</button>
		)
	}
}

export default Twitter

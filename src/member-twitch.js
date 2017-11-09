import React, { Component } from 'react';

class Twitch extends Component {
	clickLink = () => {
		if ( this.props.owner === true ) {
			this.props.edit("twitch")
			return
		}
		if ( this.props.id === "" ) {
			return
		}
		window.open("https://go.twitch.tv/" + this.props.id)
	}
	render = () => {
		var classes = "btn"
		var style = {
			width: "33%",
		}
		if ( this.props.id === "" ) {
			classes = classes + " btn-disabled"
		} else {
			style.color = "white"
			style.backgroundColor = "#4B397A"
		}
		return(
			<button onClick={this.clickLink} className={classes} style={style}>twitch</button>
		)
	}
}

export default Twitch

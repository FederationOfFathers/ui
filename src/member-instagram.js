import React, { Component } from 'react';

class Instagram extends Component {
	clickLink = () => {
		if ( this.props.owner === true ) {
			this.props.edit("instagram")
			return
		}
		if ( this.props.id === "" ) {
			return
		}
		window.open( "https://www.instagram.com/" + this.props.id )
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
			style.backgroundColor = "#DB3370"
		}
		return(
			<button onClick={this.clickLink} className={classes} style={style}>instagram</button>
		)
	}
}

export default Instagram

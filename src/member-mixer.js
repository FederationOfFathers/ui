import React, { Component } from 'react';

class Mixer extends Component {
	clickLink = () => {
		if ( this.props.id === "" ) {
			return
		}
		if ( this.props.owner === true ) {
			this.props.edit("mixer")
			return
		}
		window.location = "//mixer.com/" + this.props.id
	}
	render = () => {
		var classes = "btn"
		if ( this.props.id === "" ) {
			classes = classes + " btn-disabled"
		} else {
			classes = classes + " btn-primary"
		}
		return(
			<button className={classes} style={{width: "33%"}}onClick={this.clickLink}>mixer</button>
		)
	}
}

export default Mixer

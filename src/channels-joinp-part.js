import React, { Component } from 'react';

class JoinPart extends Component {
	callback = () => {
		if ( typeof this.props.callback === "undefined" ) {
			return
		}
		this.props.callback(this.props.id, this.props.type)
	}
	text = () => {
		if ( this.props.kind === "join" ) {
			return this.props.kind
		}
		if ( this.props.kind === "noop" ) {
			return "\x00\xA0"
		}
		return "leave"
	}
	render = () => {
		var classes = "mx-1 py-1 badge float-right"
		var style = {cursor: "pointer", width: "5em"}
		if ( this.props.kind === "join" ) {
			classes = classes + " badge-primary"
		} else if ( this.props.kind === "noop" ) {
			classes = classes + " badge-light"
			style.opacity = 0;
		} else {
			classes = classes + " badge-secondary"
		}
		return(
			<span className={classes} style={style} onClick={this.callback}>{this.text()}</span>
		)
	}
}

export default JoinPart

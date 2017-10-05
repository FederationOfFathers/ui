import React, { Component } from 'react';

class ChannelButton extends Component {
	click = () => {
		if ( this.props.name !== this.props.state.vars.chan ) {
			this.props.state.hasher.set({chan: this.props.name, raid: null})
		} else {
			this.props.state.hasher.set({chan: null, raid: null})
		}
	}
	render = () => {
		var btnClass = "btn w-100 my-1"
		var close = null
		if ( this.props.state.vars.chan === this.props.name ) {
			btnClass = btnClass + " btn-primary"
			close = (
				<span className="float-right text-dark">▼</span>
			)
		} else {
			if ( this.props.state.vars.chan !== null && typeof this.props.state.vars.chan !== "undefined" ) {
				return null
			}
		}
		return (
			<button className={btnClass} onClick={this.click} style={{whiteSpace: "nowrap"}}>{close}
				#{this.props.name} <span className="float-left mx-1 badge badge-dark">{this.props.keys.length}</span>
			</button>
		)
	}
}

export default ChannelButton

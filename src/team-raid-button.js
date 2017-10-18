import React, { Component } from 'react';

class RaidButton extends Component {
	click = () => {
		if ( this.props.state.vars.raid !== this.props.data.uuid ) {
			this.props.state.hasher.set({raid: this.props.data.uuid})
		} else {
			this.props.state.hasher.set({raid: null})
		}
	}
	shortName = () => {
		var name = this.props.data.name
		name = name.replace(/^\[[^]*\] /i, "")
		return name
	}
	render = () => {
		var alts = []
		if ( typeof this.props.data.alts !== "undefined" && this.props.data.alts !== null ) {
			alts = this.props.data.alts
		}
		var buttonClass = "my-1 btn btn-primary w-100"
		var close = (
				<span className="float-right text-dark">▼</span>
			)
		if ( this.props.state.vars.raid === this.props.data.uuid ) {
			buttonClass = buttonClass + " btn-primary"
			close = (
				<span className="float-right text-dark">▲</span>
			)
		} else {
			if ( typeof this.props.state.vars.raid !== "undefined" && this.props.state.vars.raid !== null ) {
				return null
			}
		}
		var date = new Date(Date.parse(this.props.data.raid_time))
		var memberBadge = []
		if ( this.props.data.need > 0 ) {
			var overCount = 0 - ( this.props.data.need - (this.props.data.members.length + alts.length) )
			var needCount = Math.max(0, (this.props.data.need - (this.props.data.members.length + alts.length)))
			var needClass = "mx-1 my-1 badge"
			var needText = (<span>need {needCount}</span>)
			if ( overCount > 0 ) {
				needText = (<span>{overCount} alt{overCount === 1 ? "" : "s"}</span>)
			}
			if ( needCount > 0 ) {
				needClass = needClass + " badge-warning"
			} else {
				needClass = needClass + " badge-secondary"
			}
			memberBadge.push((
				<span key="need" className={needClass}>
					{needText}
				</span>
			))
		} else {
			memberBadge.push((
				<span key="members" className="mx-1 my-1 badge badge-secondary">{this.props.data.members.length + alts.length} member
					{(this.props.data.members.length + alts.length) === 1 ? "" : "s" }
				</span>
			))
		}
		return (
			<button className={buttonClass} style={{overflow: "hidden", textOverflow: 'ellipsis'}} onClick={this.click}>{close}
				{this.shortName()}
				<br/>
				<span className="mx-1 my-1 badge badge-dark">{date.toLocaleString('en-US')}</span>
				{memberBadge}
			</button>
		)
	}
}

export default RaidButton

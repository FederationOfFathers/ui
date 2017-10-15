import React, { Component } from 'react';
import JoinPart from './channels-joinp-part'

class Channels extends Component {
	componentWillMount = () => {
		this.setState({
			open: false,
		})
	}
	list = () => {
		if ( this.state.open === false ) {
			return
		}
		var id = this.props.member.Name
		var rval = []
		for ( var cid in this.props.state.chanList ) {
			var chan = this.props.state.chanList[cid]
			if ( chan.members.indexOf(id) >= 0 ) {
				rval.push({
					name: "#" + chan.name,
					is: "channel",
					raw: chan,
				})
			}
		}
		for ( var gid in this.props.state.groupList ) {
			var group = this.props.state.groupList[gid]
			if ( group.visible === "false" ) {
				var found = false
				for ( var mid in this.props.state.groups ) {
					if ( this.props.state.groups[mid].id === group.id ) {
						found = true
					}
				}
				if ( !found ) {
					continue
				}
				if ( group.members.indexOf(id) >= 0 ) {
					rval.push({
						name: group.name,
						is: "group",
						raw: group,
					})
				}
			}
		}
		rval.sort(function(a,b) {
			var an = a.name
			if (an.substr(0, 1) === "#") {
				an = an.substr(1)
			}
			var bn = b.name
			if (bn.substr(0, 1) === "#") {
				bn = bn.substr(1)
			}
			if (an < bn)
				return -1;
			if (an > bn)
				return 1;
			return 0;
		})
		for ( var i in rval ) {
			var button = []
			if ( rval[i].raw.members.indexOf(this.props.state.user.name) >= 0 ) {
				button.push(<JoinPart kind="part" key="part" type={rval[i].is} id={rval[i].raw.id}
						callback={this.props.state.api.slack.part}/>)
			} else {
				button.push(<JoinPart kind="join" key="join" type={rval[i].is} id={rval[i].raw.id}
						callback={this.props.state.api.slack.join}/>)
			}
			rval[i] = ( <li key={rval[i].name} className="list-group-item">{button}{rval[i].name}</li> )
		}
		return (<ul style={{fontSize: "0.75em"}} className="text-left list-group">{rval}</ul>)
	}
	click = () => {
		this.setState({
			open: !this.state.open,
		})
	}
	render = () => {
		var openClose = this.state.open ? "▲" : "▼"
		return (
			<div>
				<a onClick={this.click} className="text-light my-1 w-100 btn btn-primary">
					<span style={{fontSize: '0.8em', marginTop: ".25em"}} className="float-right text-dark">{openClose}</span>
					Channels
				</a>
				<h5>{this.list()}</h5>
			</div>
		)
	}
}

export default Channels

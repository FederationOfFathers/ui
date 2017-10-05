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
		if ( this.props.kind === "join" ) {
			classes = classes + " badge-primary"
		} else if ( this.props.kind === "noop" ) {
			classes = classes + " badge-light"
		}else {
			classes = classes + " badge-secondary"
		}
		return(
			<span className={classes} style={{cursor: "pointer", width: "5em"}} onClick={this.callback}>{this.text()}</span>
		)
	}
}

class Visibility extends Component {
	click = () => {
		if ( this.props.state.vars.chan !== this.props.data.raw.name ) {
			this.props.state.hasher.set({chan: this.props.data.raw.name})
		} else {
			this.props.state.hasher.set({chan: null})
		}
	}
	render = () => {
		var text = "hidden"
		if ( this.props.visible === "true" ) {
			text = "public"
		}
		if ( this.props.data.is === "channel" ) {
			text="channel"
		} else {
			if ( this.props.state.vars.chan === this.props.data.raw.name ) {
				text = (
					<span>
						<span style={{fontSize: '0.8em', marginTop: ".25em"}} className="float-right text-dark">
							▼
						</span>
						{text}
					</span>
				)
			}
		}
		return(
			<span onClick={this.click} className="py-1 float-right badge badge-secondary" style={{width: "7em", cursor: "pointer"}}>{text}</span>
		)
	}
}

class Channels extends Component {
	merge = () => {
		var list = [];
		for ( var c in this.props.state.chanList ) {
			list.push({
				sortname: this.props.state.chanList[c].name.replace(/[^a-zA-Z0-9]/, ""),
				raw: this.props.state.chanList[c],
				is: "channel",
				member: (this.props.state.chanList[c].members.indexOf(this.props.state.user.name) >= 0),
			})
		}
		for ( var g in this.props.state.groupList ) {
			list.push({
				sortname: this.props.state.groupList[g].name.replace(/[^a-zA-Z0-9]/, ""),
				raw: this.props.state.groupList[g],
				is: "group",
				member: (this.props.state.groupList[g].members.indexOf(this.props.state.user.name) >= 0),
			})
		}
		list.sort(function(a,b) {
			if (a.sortname < b.sortname)
				return -1;
			if (a.sortname > b.sortname)
				return 1;
			return 0;
		})
		return list
	}
	groups = () => {
		var list = this.merge()
		var elements = [];
		for ( var i in list ) {
			var classes = "list-group-item"
			var button = []

			if ( list[i].member === true ) {
				button.push(<JoinPart kind="part" key="part" type={list[i].is} id={list[i].raw.id}
					callback={this.props.state.api.slack.part}/>)
				classes = classes + " list-group-item-primary"
			} else {
				if ( list[i].raw.visible === "true" ) {
					button.push(<JoinPart kind="join" key="join" type={list[i].is} id={list[i].raw.id}
						callback={this.props.state.api.slack.join}/>)
				} else if ( this.props.state.admin === true ) {
					button.push(<JoinPart kind="noop" key="join" type={list[i].is} id={list[i].raw.id}/>)
				}
				classes = classes + " list-group-item-secondary"
			}

			var prefix = ""
			if ( list[i].is === "channel" ) {
				prefix = "#"
			}

			button.push((<Visibility key="visi" state={this.props.state} data={list[i]} visible={list[i].raw.visible}/>))
			if ( list[i].is !== "channel" && this.props.state.vars.chan === list[i].raw.name ) {
				var nv = "public"
				if ( list[i].raw.visible === "true" ) {
					nv = "private"
				}
				if ( this.props.state.admin ) {
					button.push((
						<div key="admin" className="my-3" style={{textAlign: "left"}}>
							<button className="btn btn-danger w-100">Make {list[i].is} {nv}</button>
						</div>
					))
				} else {
					button.push((
						<div key="user" className="my-3" style={{textAlign: "left"}}>
							<button className="btn btn-primary w-100">Request {list[i].is} be made {nv}</button>
						</div>
					))
				}
			}

			elements.push((
				<li key={list[i].raw.name} className={classes}>{prefix}{list[i].raw.name} {button}</li>
			))
		}
		return elements
	}
	render() {
		return (
			<ul className="list-group">
				{this.groups()}
			</ul>
		);
	}
}

export default Channels

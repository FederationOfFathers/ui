import React, { Component } from 'react';

class JoinPart extends Component {
	callback = () => { this.props.callback(this.props.id, this.props.type) }
	render = () => {
		var classes = "mx-1 py-1 badge float-right"
		if ( this.props.kind === "join" ) {
			classes = classes + " badge-primary"
		} else {
			classes = classes + " badge-secondary"
		}
		return(
			<span className={classes} style={{cursor: "pointer", width: "5em"}} onClick={this.callback}>{this.props.kind}</span>
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
					<span>{text}
						<span style={{fontSize: '0.9em'}} type="button" className="close" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</span>
					</span>
				)
			}
		}
		return(
			<span onClick={this.click} className="py-1 float-right badge badge-secondary" style={{width: "6em", cursor: "pointer"}}>{text}</span>
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

			button.push((<Visibility key="visi" state={this.props.state} data={list[i]} visible={list[i].raw.visible}/>))
			// TODO:
			// members: request visibility change
			// admins: change visibility

			if ( list[i].member === true ) {
				button.push(<JoinPart kind="part" key="part" type={list[i].is} id={list[i].raw.id}
					callback={this.props.state.api.slack.part}/>)
				classes = classes + " list-group-item-primary"
			} else {
				if ( list[i].raw.visible === "true" ) {
					button.push(<JoinPart kind="join" key="join" type={list[i].is} id={list[i].raw.id}
						callback={this.props.state.api.slack.join}/>)
				}
				classes = classes + " list-group-item-secondary"
			}

			var prefix = ""
			if ( list[i].is === "channel" ) {
				prefix = "#"
			}
			if ( list[i].is !== "channel" && this.props.state.vars.chan === list[i].raw.name ) {
				var nv = "public"
				if ( list[i].raw.visible === "true" ) {
					nv = "private"
				}
				if ( this.props.state.admin ) {
					button.push((
						<div key="admin" style={{textAlign: "left"}}>
							<button className="btn btn-danger w-75">Make {list[i].is} {nv}</button>
						</div>
					))
				} else {
					button.push((
						<div key="user" style={{textAlign: "left"}}>
							<button className="btn btn-primary w-75">Request {list[i].is} be made {nv}</button>
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

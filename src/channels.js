import React, { Component } from 'react';
import JoinPart from './channels-joinp-part'
import ChannelStats from './channels-stats'

class Visibility extends Component {
	click = () => {
		if ( this.props.state.vars.chan !== this.props.data.raw.name ) {
			this.props.state.hasher.set({chan: this.props.data.raw.name})
		} else {
			this.props.state.hasher.set({chan: null})
		}
	}
	render = () => {
		var raw = "hidden"
		var text = (
			<span>
				<span style={{fontSize: '0.8em', marginTop: ".25em"}} className="float-right text-dark">
					▼
				</span>
				hidden
			</span>
		)
		if ( this.props.visible === "true" ) {
			raw = "public"
			text = (
				<span>
					<span style={{fontSize: '0.8em', marginTop: ".25em"}} className="float-right text-dark">
						▼
					</span>
					public
				</span>
			)
		}
		if ( this.props.data.is === "channel" ) {
			return null
		} else {
			if ( this.props.state.vars.chan === this.props.data.raw.name ) {
				text = (
					<span>
						<span style={{fontSize: '0.8em', marginTop: ".25em"}} className="float-right text-dark">
							▲
						</span>
						{raw}
					</span>
				)
			}
		}
		return(
			<span onClick={this.click} className="py-1 float-right badge badge-secondary" style={{width: "7em", cursor: "pointer"}}>
				{text}
			</span>
		)
	}
}

class ToggleVisibility extends Component {
	componentWillMount = () => {
		this.setState({
			requested: false,
		})
	}
	doToggle = () => {
		if ( this.props.nv === "public" ) {
			return this.props.state.api.slack.visibility(this.props.list[this.props.i].raw.id, "true")
		} else {
			return this.props.state.api.slack.visibility(this.props.list[this.props.i].raw.id, "false")
		}
	}
	toggleVisibility = () => {
		this.doToggle()
			.then(function() {
				if ( this.props.state.admin ) {
					return;
				}
				this.setState({requested: true})
			}.bind(this))
	}
	render = () => {
		if ( this.state.requested ) {
			return (<div className="alert alert-success" role="alert">Request Sent</div>)
		}
		if ( this.props.state.admin ) {
			return (
				<div key="admin" className="my-3" style={{textAlign: "left"}}>
					<button onClick={this.toggleVisibility} className="btn btn-danger w-100">
						Make {this.props.list[this.props.i].is} {this.props.nv}
					</button>
				</div>
			)
		} else {
			return(
				<div key="user" className="my-3" style={{textAlign: "left"}}>
					<button onClick={this.toggleVisibility} className="btn btn-primary w-100">
						Request {this.props.list[this.props.i].is} be made {this.props.nv}
					</button>
				</div>
			)
		}
	}
}

class Channels extends Component {
	componentWillMount = () => {
		this.setState({
			filter: "",
			viewing: "details",
		})
	}
	toggleViewing = () => {
		if ( this.state.viewing === "details" ) {
			this.setState({viewing:"stats"})
		} else {
			this.setState({viewing:"details"})
		}
	}
	merge = () => {
		var match = this.state.filter.toLowerCase()
		var list = [];
		for ( var c in this.props.state.chanList ) {
			if ( !this.props.state.chanList[c].name.toLowerCase().includes(match) ) {
				continue
			}
			list.push({
				sortname: this.props.state.chanList[c].name.replace(/[^a-zA-Z0-9]/, ""),
				raw: this.props.state.chanList[c],
				is: "channel",
				member: (this.props.state.chanList[c].members.indexOf(this.props.state.user.name) >= 0),
			})
		}
		for ( var g in this.props.state.groupList ) {
			if ( !this.props.state.groupList[g].name.toLowerCase().includes(match) ) {
				continue
			}
			var isMember = (this.props.state.groupList[g].members.indexOf(this.props.state.user.name) >= 0)
			if ( isMember === false && this.props.state.admin === false && this.props.state.groupList[g].visible !== "true" ) {
				continue
			}
			list.push({
				sortname: this.props.state.groupList[g].name.replace(/[^a-zA-Z0-9]/, ""),
				raw: this.props.state.groupList[g],
				is: "group",
				member: isMember,
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
				button.push(<ToggleVisibility i={i} list={list} nv={nv} state={this.props.state}/>)
			}

			elements.push((
				<li key={list[i].raw.name} className={classes}>{prefix}{list[i].raw.name} {button}</li>
			))
		}
		return elements
	}
	render() {
		var content = null
		if ( this.state.viewing === "stats" ) {
			content = (<ChannelStats state={this.props.state}/>)
		} else {
			content = this.groups()
		}
		return (
			<div>
				<button className="btn btn-primary w-100 my-1" onClick={this.toggleViewing}>
					Switch to channel { this.state.viewing === "stats" ? "details" : "stats" }
				</button>
				<input onChange={(e)=>{
					this.setState({filter:e.target.value})
				}}
				type="text" className="form-text form-control w-100 my-1" value={this.state.filter} placeholder="filter"/>
				<ul className="list-group">{content}</ul>
			</div>
		);
	}
}

export default Channels

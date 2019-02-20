import React, { Component } from 'react';
import LinkBar from './member-linkbar'
import Channels from './member-channels'
import SlackStats from './member-slack-activity'
import Games from './member-games'
import Slack from './lib/slack-deep-link'
import MembersNav from './nav-members'
import MemberEdit from './member-edit'
import styled from 'styled-components'
import {MemberActionButton} from './shared-styles'
import './member.css'

const CancelButton = styled(MemberActionButton)`
	background-color: white;
	color: grey;
`

class Member extends Component {
	componentDidMount = () => {
		this.setState({mounted: true, save: false})
	}
	constructor(props) {
		super(props);
		this.state = {
			currentID: props.member.id,
			mounted: false,
			fetch: false,
			meta: {},
			streams: {},
		}
	}
	componentDidUpdate = ( p ) => {
		if ( this.state.mounted === false ) {
			return
		}
		if ( this.state.currentID !== this.props.member.id ) {
			this.setState({fetch: false, currentID: this.props.member.id})
		}
		if ( this.state.fetch === false ) {
			this.fetch()
		}
	}
	async fetch() {
		var now = new Date()
		this.setState({fetch: now.getTime()})
		try {
			await this.props.state.api.user.streams.get(this.state.currentID);
			await this.props.state.api.user.meta.get(this.state.currentID);	
								
			this.setState({
				meta: this.props.state.meta.users[this.state.currentID],
				streams: this.props.state.meta.streams[this.props.member.id]
			});
		} catch(err) {
			console.error("Unable to fetch user data - " + err)
			this.setState({fetch: false});
		}
	}
	editFinished = () => {
		this.setState({fetch: false});
		this.setState({editMode: false});
	}
	render = () => {
		const isOwner = this.props.member.name === this.props.state.user.name;
		return (
			<div className="members">
				<MembersNav state={this.props.state}/>
				<div className="member-head" style={{display: 'flex'}}>
					<div className="member-name col-sm-10">
						<h4 className="card-title" onClick={()=>{window.location=Slack.link("user",this.props.member.slack)}}>
							<img
								className="float-left mx-2 clearfix"
								style={{width: '48px', height: '48px'}}
								alt="" src={this.props.member.Image}/>
							{this.props.member.Name}
						</h4>
						<h6 className="card-subtitle mb-2 text-muted">
							{this.props.member.DisplayName}
						</h6>
					</div>
					<div className="member-actions col">
						{ isOwner && 
							(!this.state.editMode ?
							<MemberActionButton style={{fontSize: 'x-large',width: '50px', height: '50px'}} onClick={()=>{this.setState({editMode: true})}}><span className="oi oi-pencil" title="pencil" aria-hidden="true"></span></MemberActionButton> :
							<CancelButton style={{fontSize: 'x-large',width: '50px', height: '50px'}} onClick={()=>{this.setState({editMode: false})}}><span className="oi oi-x" title="cancel" aria-hidden="true"></span></CancelButton> )
						}
					</div>
				</div>
				<div className="py-1">
				{ this.state.editMode ?
					(<MemberEdit member={this.props.member} state={this.props.state} meta={this.state.meta} editCallback={this.editFinished} />) :
					(<div>
						<LinkBar state={this.props.state} meta={this.state.meta} member={this.props.member} streams={this.state.streams}/>
					</div>
					)
				}
				</div>
			</div>
		
		);
	}
}

export default Member

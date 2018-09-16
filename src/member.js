import React, { Component } from 'react';
import LinkBar from './member-linkbar'
import Channels from './member-channels'
import SlackStats from './member-slack-activity'
import Games from './member-games'
import Slack from './lib/slack-deep-link'
import MembersNav from './nav-members'
import MemberEdit from './member-edit'
import {MemberActionButton} from './shared-styles'

class Member extends Component {
	componentDidMount = () => {
		this.setState({mounted: true, save: false})
	}
	componentWillMount = () => {
		this.setState({
			currentID: this.props.member.ID,
			mounted: false,
			fetch: false
		})
	}
	componentDidUpdate = ( p ) => {
		if ( this.state.mounted === false ) {
			return
		}
		if ( this.state.currentID !== this.props.member.ID ) {
			this.setState({fetch: false, currentID: this.props.member.ID})
		}
		if ( this.state.fetch === false ) {
			this.fetch()
		}
	}
	fetch = () => {
		var now = new Date()
		this.setState({fetch: now.getTime()})
		this.props.state.api.user.streams.get(this.state.currentID)
			.then(function() {
				this.props.state.api.user.meta.get(this.state.currentID)
					.then(function() {
						this.props.state.api.user.meta.get(this.state.currentID)
							.then(()=>{
								this.setState({meta: this.props.state.meta.users[this.state.currentID]})
							})
					}.bind(this))
			}.bind(this))
			.catch(function() {
				this.setState({fetch: false})
			}.bind(this))
	}
	reloadMeta = () => {
		this.setState({meta: this.props.state.meta.users[this.state.currentID]})
	}
	editFinished = () => {
		console.log("EDIT FINISHED")
		this.setState({editMode: false})
	}
	render = () => {
		const isOwner = this.props.member.Name === this.props.state.user.name;
		return (
			<div className="members">
				<MembersNav state={this.props.state}/>
				<div className="member-head" style={{display: 'flex'}}>
					<div className="member-name">
						<h4 className="card-title" onClick={()=>{window.location=Slack.link("user",this.props.member.ID)}}>
							<img
								className="float-left mx-2 clearfix"
								style={{width: '64px', height: '64px'}}
								alt="" src={this.props.member.Image}/>
							{this.props.member.Name}
						</h4>
						<h6 className="card-subtitle mb-2 text-muted">
							{this.props.member.DisplayName}
						</h6>
					</div>
					<div className="member-actions" style={{'padding-left': '5px'}}>
						{ isOwner && 
							(!this.state.editMode &&
								<MemberActionButton icon='edit' onClick={()=>{this.setState({editMode: true})}}>edit</MemberActionButton>
							) 
						}
					</div>
				</div>
				<div className="py-1">
				{ this.state.editMode ?
					(<MemberEdit member={this.props.member} state={this.props.state} editCallback={this.editFinished}/>) :
					(<div>
						<LinkBar state={this.props.state} meta={this.state.meta} member={this.props.member} reloadMeta={this.reloadMeta}/>
						<SlackStats member={this.props.member} state={this.props.state}/>
						<Channels member={this.props.member} state={this.props.state}/>
						<Games member={this.props.member} state={this.props.state}/>
					</div>
					)
				}
				</div>
			</div>
		
		);
	}
}

export default Member

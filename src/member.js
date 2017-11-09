import React, { Component } from 'react';
import LinkBar from './member-linkbar'
import Channels from './member-channels'
import SlackStats from './member-slack-activity'
import Games from './member-games'
import Slack from './lib/slack-deep-link'
import MembersNav from './nav-members'

class Member extends Component {
	componentDidMount = () => {
		this.setState({mounted: true})
	}
	componentWillMount = () => {
		this.setState({
			currentID: this.props.member.ID,
			mounted: false,
			fetch: false,
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
	render = () => {
		return (
			<div className="members">
				<MembersNav state={this.props.state}/>
				<div className="card">
					<div className="card-body">
						<div className="clearfix">
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
						<div className="py-1">
							<LinkBar state={this.props.state} meta={this.state.meta} member={this.props.member} reloadMeta={this.reloadMeta}/>
							<SlackStats member={this.props.member} state={this.props.state}/>
							<Channels member={this.props.member} state={this.props.state}/>
							<Games member={this.props.member} state={this.props.state}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Member

import React, { Component } from 'react';
import LinkButton from './member-link-button'
import './member-linkbar.css'
import {getValueOrEmpty } from './values'

class LinkBar extends Component {
	render = () => {
		const data = {
			xbl: getValueOrEmpty(this.props.member.xbox),
			psn: getValueOrEmpty(this.props.meta.psn),
			bnet: getValueOrEmpty(this.props.meta.bnet),
			twitch: getValueOrEmpty(this.props.streams.Twitch),
			mixer: getValueOrEmpty(this.props.streams.Beam),
			youtube: getValueOrEmpty(this.props.streams.Youtube),
			twitter: getValueOrEmpty(this.props.meta.twitter),
			instagram: getValueOrEmpty(this.props.meta.instagram),
		}
		return(
			<div className="link-buttons">
				{
					(data.xbox || data.psn || data.bnet) &&
					<div className="link-button-group">
						<h5>Gaming Networks</h5>
						<LinkButton className="xbox" 
							text={ getValueOrEmpty(data.xbl)}
							link={"https://account.xbox.com/en-US/Profile?GamerTag=" + data.xbox}/>
						<LinkButton className="psn" 
							text={data.psn}
							link={"https://my.playstation.com/profile/" + data.psn}/>
						<LinkButton className="bnet" 
							text={data.bnet}
							isCopyAction={true}/>
					</div>
				}
				{ 
					(data.twitch || data.mixer) &&
					<div className="link-button-group">
						<h5>Streaming Channels</h5>
						<LinkButton className="twitch"
							text={data.twitch}
							link={"https://go.twitch.tv/" + data.twitch}/>
						<LinkButton className="mixer"
							text={data.mixer}
							link={"https://mixer.com/" + data.mixer}/>
						<LinkButton className="youtube"
							text={data.youtube}/>
					</div>
				 }
				{
					(data.twitter || data.instagram) &&
					<div className="link-button-group">
						<h5>Social Media</h5>
						<LinkButton className="twitter" 
							text={data.twitter}
							link={"https://twitter.com/" + data.twitter}/>
						<LinkButton className="instagram"
							text={data.instagram}
							link={"https://www.instagram.com/" + data.instagram}/>
					</div>
				}
				
			</div>
		)
	}
}

export default LinkBar

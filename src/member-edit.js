import React, { Component } from 'react';
import './member-edit.css'
import { MemberActionButton} from './shared-styles'
import styled from 'styled-components'
import {getValueOrEmpty} from './values'

const CancelButton = styled(MemberActionButton)`
	background-color: white;
	color: grey;
`

class MemberEdit extends Component {
    constructor(props) {
        super(props);
        const originalData = {
            xbl: getValueOrEmpty(props.member.GamerTag),
            psn: getValueOrEmpty(props.state.meta.users[props.member.ID].psn),
            bnet: getValueOrEmpty(props.state.meta.users[props.member.ID].bnet),
            twitch: getValueOrEmpty(props.state.meta.streams[props.member.ID].Twitch),
            beam: getValueOrEmpty(props.state.meta.streams[props.member.ID].Beam), // Why is this still called Beam?
            youtube: getValueOrEmpty(props.state.meta.streams[props.member.ID].Youtube),
            twitter: getValueOrEmpty(props.state.meta.users[props.member.ID].twitter),
            instagram: getValueOrEmpty(props.state.meta.users[props.member.ID].instagram),
        }
        this.state = {
            saving: false,
            originalData,
            xbl: originalData.xbl,
            psn: originalData.psn,
            bnet: originalData.bnet,
            twitch: originalData.twitch,
            beam: originalData.beam,
            youtube: originalData.youtube,
            twitter: originalData.twitter,
            instagram: originalData.instagram,
        };
    }
    saveMemberData = async () => {
        this.setState({saving: true});
        
        // iterate over original data and find changes
        for (var key in this.state.originalData) {
            if (this.state.originalData[key] !== this.state[key]){
                await this.updateData(key);
            }
        }
        
        this.setState({saving: false});
        this.props.editCallback();
    }
    async updateXbox(propertyName) {
        // So, this doesn't exactly work since we're currently loading Xbox GamerTag from Slack, which should change
        // this will probably always be `xbl`, but to keep code consistent, we'll use propertyName
        await this.props.state.api.user.set.xbl(this.props.member.ID, this.state[propertyName])
    }
    async updateMeta(propertyName) {
        await this.props.state.api.user.meta.set(this.props.member.ID, propertyName, this.state[propertyName])
    }
    async updateStream(propertyName) {
        await this.props.state.api.user.streams.set(this.props.member.ID, propertyName, this.state[propertyName])
    }
    async updateData(propertyName) {
        switch(propertyName) {
            case 'xbl':
                await this.updateXbox(propertyName);
                break;
            case 'psn':
            case 'bnet':
            case 'twitter':
            case 'instagram':
                await this.updateMeta(propertyName);
                break;
            case 'twitch':
            case 'beam':
            case 'youtube':
                await this.updateStream(propertyName);
                break;
            default:
                break;
        }
        
    }
    cancel = () => {
        this.props.editCallback();
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
	render = () => {
		if (this.props.member.Name === this.props.state.user.name) {
            return (
                <div className="member-edit-form">
                    <div className="member-edit-form-actions">
                        { this.state.saving ?
                            <MemberActionButton >saving...</MemberActionButton> :
                            <MemberActionButton icon='save' onClick={this.saveMemberData} >save</MemberActionButton>
                        }
                        <CancelButton icon='cancel' onClick={this.cancel}>cancel</CancelButton>
                    </div>
                    <div className="member-edit-form-section">
                        <h3>Gaming Networks</h3>
                        <div className="field xbl"><label htmlFor="xbl">Xbox:</label> <input value={this.state.xbl} onChange={this.handleInputChange} name="xbl"/></div>
                        <div className="field psn"><label htmlFor="psn">PSN:</label> <input value={this.state.psn} onChange={this.handleInputChange} name="psn"/></div>
                        <div className="field bnet"><label htmlFor="bnet">Battle.net:</label> <input value={this.state.bnet} onChange={this.handleInputChange} name="bnet"/></div>
                    </div>
                    <div className="member-edit-form-section">
                        <h3>Streaming</h3>
                        <div className="field twitch"><label htmlFor="twitch">Twitch:</label> <input value={this.state.twitch} onChange={this.handleInputChange} name="twitch"/></div>
                        <div className="field mixer"><label htmlFor="mixer">Mixer:</label> <input value={this.state.beam} onChange={this.handleInputChange} name="beam"/></div>
                        <div className="field youtube"><label htmlFor="youtube">YouTube:</label> <input value={this.state.youtube} onChange={this.handleInputChange} name="youtube"/></div>
                    </div>
                    <div className="member-edit-form-section">
                        <h3>Social Media</h3>
                        <div className="field twitter"><label htmlFor="twitter">Twitter:</label> <input value={this.state.twitter} onChange={this.handleInputChange} name="twitter"/></div>
                        <div className="field instagram"><label htmlFor="instagram">instagram:</label> <input value={this.state.instagram} onChange={this.handleInputChange} name="instagram"/></div>
                    </div>
                </div>
            );
        } else {
            return (<div>GET OUT!</div>);
        }
		
	}
}

export default MemberEdit

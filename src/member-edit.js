import React, { Component } from 'react';
import './member-edit.css'
import { MemberActionButton} from './shared-styles'
import {getValueOrEmpty} from './values'
import Filter from './lib/sanitize-social-input'

class MemberEdit extends Component {
    constructor(props) {
        super(props);
        const originalData = {
            loc: getValueOrEmpty(props.state.meta.users[props.member.ID].loc),
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
            loc: originalData.loc,
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
    componentDidMount = () => {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
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
    updateXbox = async (propertyName) => {
        // So, this doesn't exactly work since we're currently loading Xbox GamerTag from Slack, which should change
        // this will probably always be `xbl`, but to keep code consistent, we'll use propertyName
        await this.props.state.api.user.set.xbl(this.props.member.ID, Filter.social(this.state[propertyName]))
    }
    updateMeta = async (propertyName) => {
        await this.props.state.api.user.meta.set(this.props.member.ID, propertyName, Filter.social(this.state[propertyName]))
    }
    updateStream = async (propertyName) => {
        await this.props.state.api.user.streams.set(this.props.member.ID, propertyName, Filter.social(this.state[propertyName]))
    }
    updateData = async (propertyName) => {
        switch(propertyName) {
            case 'xbl':
                await this.updateXbox(propertyName);
                break;
            case 'loc':
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
    handleSubmit = async (e) => {
        e.preventDefault();
        await this.saveMemberData();
    }
    escFunction = (e) => {
        if (e.keyCode === 27) {
            this.cancel();
        } 
    }
	render = () => {
		if (this.props.member.Name === this.props.state.user.name) {
            return (
                <form className="member-edit-form col" onSubmit={this.handleSubmit}>
                    <div className="member-edit-form-actions">
                        { this.state.saving ?
                            <MemberActionButton >saving...</MemberActionButton> :
                            <MemberActionButton type='submit' icon='save' >save</MemberActionButton>
                        }
                    </div>
                    <div className="member-edit-form-section">
                        <h3>Personal Info</h3>
                        <div className="field loc">
                            <label htmlFor="loc">Location:</label>
                            <input value={this.state.loc} onChange={this.handleInputChange} name="loc" placeholder="City, State/Province, Country"/>
                        </div>
                    </div>
                    <div className="member-edit-form-section">
                        <h3>Gaming Networks</h3>
                        <div className="field xbl">
                            <label htmlFor="xbl"><img src="/images/icon-xbox.png" alt="Xbox"/></label>
                            <input value={this.state.xbl} onChange={this.handleInputChange} name="xbl" placeholder="Xbox"/>
                        </div>
                        <div className="field psn">
                            <label htmlFor="psn"><img src="/images/icon-psn.png" alt="PSN"/></label>
                            <input value={this.state.psn} onChange={this.handleInputChange} name="psn" placeholder="PSN"/>
                        </div>
                        <div className="field bnet">
                            <label htmlFor="bnet"><img src="/images/icon-bnet.png" alt="Battle.net"/></label>
                            <input value={this.state.bnet} onChange={this.handleInputChange} name="bnet" placeholder="Battle.net"/>
                        </div>
                    </div>
                    <div className="member-edit-form-section">
                        <h3>Streaming Channels</h3>
                        <div className="field twitch">
                            <label htmlFor="twitch"><img src="/images/icon-twitch.png" alt="Twitch"/></label>
                            <input value={this.state.twitch} onChange={this.handleInputChange} name="twitch" placeholder="Twitch"/>
                        </div>
                        <div className="field mixer">
                            <label htmlFor="mixer"><img src="/images/icon-mixer.png" alt="Mixer"/></label>
                            <input value={this.state.beam} onChange={this.handleInputChange} name="beam" placeholder="Mixer"/>
                        </div>
                        {/* Youtube manual input is not accurate. This needs to be implemented with OAuth to get the proper value
                        <div className="field youtube">
                            <label htmlFor="youtube"><img src="/images/icon-youtube.png" alt="YouTube"/></label>
                            <input value={this.state.youtube} onChange={this.handleInputChange} name="youtube" placeholder="YouTube (soon)"/>
                        </div> */}
                    </div>
                    <div className="member-edit-form-section">
                        <h3>Social Media</h3>
                        <div className="field twitter">
                            <label htmlFor="twitter"><img src="/images/icon-twitter.png" alt="Twitter"/></label>
                            <input value={this.state.twitter} onChange={this.handleInputChange} name="twitter" placeholder="Twitter"/>
                        </div>
                        <div className="field instagram">
                            <label htmlFor="instagram"><img src="/images/icon-instagram.png" alt="Instagram"/></label>
                            <input value={this.state.instagram} onChange={this.handleInputChange} name="instagram" placeholder="Instagram"/>
                        </div>
                    </div>
                </form>
            );
        } else {
            return (<div>GET OUT!</div>);
        }
		
	}
}

export default MemberEdit

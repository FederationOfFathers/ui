import React, { Component } from 'react';
import './member-edit.css'
import { MemberActionButton} from './shared-styles'
import styled from 'styled-components'

const CancelButton = styled(MemberActionButton)`
	background-color: white;
	color: grey;
`

class MemberEdit extends Component {
    saveMemberData = () => {
        // do some stuff to save here
        this.props.editCallback();
    }
    cancel = () => {
        this.props.editCallback();
    }
	render = () => {
		if (this.props.member.Name === this.props.state.user.name) {
            return (
                <div className="member-edit-form">
                    <div className="member-edit-form-actions">
                        <MemberActionButton icon='save' onClick={this.saveMemberData} >save</MemberActionButton>
                        <CancelButton icon='cancel' onClick={this.cancel}>cancel</CancelButton>
                    </div>
                    <div className="member-edit-form-section">
                        <h3>Gamer Tags</h3>
                        <div className="field xbl"><label for="xbl">Xbox:</label> <input name="xbl"/></div>
                        <div className="field ps4"><label for="ps4">PS4:</label> <input name="ps4"/></div>
                        <div className="field bnet"><label for="bnet">Battle.net:</label> <input name="bnet"/></div>
                    </div>
                    <div className="member-edit-form-section">
                        <h3>Streaming</h3>
                        <div className="field twitch"><label for="twitch">Twitch:</label> <input name="twitch"/></div>
                        <div className="field mixer"><label for="mixer">Mixer:</label> <input name="mixer"/></div>
                        <div className="field youtube"><label for="youtube">YouTube:</label> <input name="youtube"/></div>
                    </div>
                    <div className="member-edit-form-section">
                        <h3>Social Media</h3>
                        <div className="field twitter"><label for="twitter">Twitter:</label> <input name="twitter"/></div>
                        <div className="field instagram"><label for="instagram">instagram:</label> <input name="instagram"/></div>
                    </div>
                </div>
            );
        } else {
            return (<div>GET OUT!</div>);
        }
		
	}
}

export default MemberEdit

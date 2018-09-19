import React, { Component } from 'react';
import {Button} from './shared-styles';

class MemberLinkButton extends Component {
    handleClick = (event) => {
        if (this.props.isCopyAction) {
            this.copyToClipboard(event.currentTarget);
        } else if (this.props.link !== undefined && this.props.link !== "") {
            window.open(this.props.link);
        }
    }
    copyToClipboard() {
        const el = document.createElement('textarea');
        el.value = this.props.text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el)
    }
    render = () => {
        // renders only if `text` is not empty
        if (this.props.text !== undefined && this.props.text !== "") {
            return (
                <Button className={this.props.className} onClick={this.handleClick}>
                    <span className="icon"></span>
                    <span className="text">{this.props.text}</span>
                </Button>
            );
        } else {
            return '';
        }
        
    }
}

export default MemberLinkButton;
import React, { Component } from 'react';

class Team extends Component {
        render() {
                if ( this.props.state.navHeight < 1 ) {
                        return(<div/>)
                }
                return (
                        <div className="team">
                                <iframe
                                        title="team tool"
                                        src="//dashboard.fofgaming.com/api/v0/redirect/team-tool"
                                        className="embed-responsive embed-responsive-item border-0 fixed-top"
                                        style={{
                                            width: this.props.state.windowWidth,
                                            height: this.props.state.windowHeight - this.props.state.navHeight,
                                        }}
                                 />
                        </div>
                );
        }
}

export default Team

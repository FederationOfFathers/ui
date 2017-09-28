import React, { Component } from 'react';

class Roster extends Component {
        render() {
                if ( this.props.state.navHeight < 1 ) {
                        return(<div/>)
                }
                return (
                        <div className="roster">
                                <iframe
                                        title="roster list"
                                        src="//fofgaming.com/friends/"
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

export default Roster

import React, {Component} from 'react'
import EventMember from './event-member'
import EventActionButton from './event-action-button'

// props event, state
class Event extends Component {
    constructor(props) {
        super(props)

        this.state={
            expanded: false,
        }
    }

    clickHandler = () => {
        this.setState({expanded: !this.state.expanded})
    }

    eventMembers = () => {
        if (!this.state.expanded) {
            return null
        }
        let eventHost = () => null;
        let eventMembers = []
        let eventAlts = []

        // add members
        for (let i in this.props.event.Members) {
            let member = this.props.event.Members[i];
            let memberCmp = <EventMember key={i} member={member} state={this.props.state}/>
            switch (member.Type) {
                case 0: // host
                    eventHost = memberCmp;
                    break;
                case 1:
                    eventMembers.push(memberCmp);
                    break;
                case 2:
                    eventAlts.push(memberCmp);
                    break;
                default:
            }
        }

        // add event host to the top
        eventMembers.unshift(eventHost)
		eventMembers.push(eventAlts);

        return eventMembers
    }

    eventActionButtons = () => {
        // add buttons to join if spots are available
		return <EventActionButton event={this.props.event} state={this.props.state}/>
    }

    render = () => {
        let date = new Date(this.props.event.When)
        let numMembers = this.props.event.Members.length;
        
        return (
            <div className="single-event">
                <button className="btn btn-block btn-dark d-flex flex-row justify-content-around align-items-center" onClick={this.clickHandler}>
                    <div className="w-100">
                        <div>{this.props.event.Title}</div>
                        <div>
                            <span className="badge badge-light">{date.toLocaleString('en-US')}</span> <span className="badge badge-success">{numMembers} / {this.props.event.Need}</span>
                        </div>
                    </div>
                </button>
                
                { this.state.expanded &&
                    <div className="event-members">
                        {this.eventActionButtons()}
                        <h6>Members ⇊ </h6>
                        {this.eventMembers()}
                    </div>
                }
                    
                
            </div>
        )
    }
}

export default Event

import React, {Component} from 'react'

/**
 *   empty member spot that can be joined as member or alt
 * props - event, state
 **/

class EventActionButton extends Component {

    userIsHost = () => {
        for (let i in this.props.event.Members) {
            if (this.props.event.Members[i].MemberID === this.props.state.user.id
				&& this.props.event.Members[i].Type === 0) {
                return true
            }
        }
        return false
    }

    joinEvent = async () => {
        await this.props.state.api.team.join(this.props.event.ID, 1)
    }
	joinEventAlt = async () => {
		await this.props.state.api.team.join(this.props.event.ID, 2)
	}
    deleteEvent = async () => {
        await this.props.state.api.team.close(this.props.event.ID)
    }

    render = () => {

        if (this.userIsHost()) {
        	return (<button className="btn btn-block btn-danger" onClick={this.deleteEvent}>Delete the event</button>)
        }

        if (this.props.event.Members.length >= this.props.event.Need) {
            return (<button className="btn btn-block btn-info" onClick={this.joinEventAlt}>Join the event as alt</button>)
        }

        return(<button className="btn btn-block btn-info" onClick={this.joinEvent}>Join the event</button>)
    }
}

export default EventActionButton

import React, {Component} from 'react'

// props member, state
class EventMember extends Component {

    memberName = () => {
        let user = this.props.state.users[this.props.member.MemberID]
        if (typeof user !== "undefined" && user !== null) {
            return this.props.state.users[this.props.member.MemberID].User.Name
        } else {
            return "(unknown user)" + this.props.member.MemberID
        }
    }

    badge = () => {
        switch(this.props.member.Type) {
            case 0:
                return <span className="badge badge-warning">host</span>
            case 1:
				return <span className="badge badge-info">member</span>
            case 2:
				return <span className="badge badge-secondary">alt</span>
            default:
                return null
        }
    }
	leaveEvent = async () => {
		await this.props.state.api.team.leave(this.props.member.EventID, this.props.member.ID)
	}
    render = () => {
		let isUser = this.props.state.user.id === this.props.member.MemberID
        return (
        	<div className="btn-group w-100" role="group" aria-label="event member">
				<button className="event-member btn btn-block btn-light">
					{this.memberName()} {this.badge()}
				</button>
				{ isUser &&
					<button className={"btn btn-danger"} onClick={this.leaveEvent}><span className="oi oi-minus" title="leave event" aria-hidden="true"></span></button>
				}
			</div>
        )
    }


}

export default EventMember

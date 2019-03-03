import React, {Component} from 'react'

// props member, state
class EventMemberEmpty extends Component {
    render = () => {
        return (
        	<div className="btn-group w-100" role="group" aria-label="event member">
				<button className="event-member btn btn-block btn-light" disabled>
					empty slot
				</button>
			</div>
        )
    }


}

export default EventMemberEmpty

import React, { Component } from 'react';
import Logout from './logout';

class Menu extends Component {
	render = () => {
		return (
			<div>
				<h2 className="text-center">App Configuration</h2>
				<hr/>
				<p><strong>History Size</strong></p>
				<form><div className="input-group">
						<span className="input-group-addon">History</span>
						<select className="form-control"
							onChange={(e) =>{
								this.props.state.callbacks.days(e.target.value)
							}}
							value={this.props.state.days}>
							<option value={7}>7 Days</option>
							<option value={14}>14 Days</option>
							<option value={30}>30 Days</option>
							<option value={60}>60 Days</option>
							<option value={90}>90 Days</option>
						</select>
				</div></form>
				<p className="text-muted text-justified">How many days to look back for games and stats</p>
				<Logout/>
			</div>
		)
	}
}

export default Menu

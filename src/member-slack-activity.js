import React, { Component } from 'react';
import { ResponsiveContainer, Legend, YAxis, XAxis, BarChart, Bar } from 'recharts';
import Moment from 'moment-timezone'

class SlackStats extends Component {
	componentWillMount = () => {
		this.setState({
			member: false,
			stats: false,
			tz: Moment.tz.guess(),
		})
	}
	componentDidUpdate = () => {
		if ( this.state.member !== this.props.member.ID ) {
			var hours = 720
			this.setState({member: this.props.member.ID, stats: false})
			this.props.state.api.stats.hourly(this.props.member.ID, 32, hours)
				.then(function(json) {
					if ( typeof json[this.props.member.ID] === "undefined" ) {
						return
					}
					var h = {}
					var m = Moment().utc()
					for ( var i=0; i<hours; i++ ) {
						if ( i > 0 ) {
							m.subtract(1, "hour")
						}
						var local = Moment.tz(m.format(), this.state.tz).format('YYYY-MM-DD')
						var label = m.format('YYYY-MM-DD HH:00:00')
						var point = m.format('YYYY-MM-DD')
						if ( typeof h[local] === "undefined" ) {
							h[local] = {name: local, v: 0}
						}
						if ( typeof json[this.props.member.ID][32][label] !== "undefined" ) {
							h[local].v += json[this.props.member.ID][32][label]
						}
					}
					var data = []
					for (var key in h) {
						data.push(h[key])
					}
					this.setState({stats: data})
				}.bind(this))
		}
	}
	render = () => {
		if ( this.state.stats === false ) {
			return null
		}
		return (
			<div className="my-1 text-center">
				<h6>Recent Slack Activity (30 days)</h6>
				<ResponsiveContainer width="100%" height={50} margin={{top: 0, right: 0, left: 0, bottom: 0}}>
					<BarChart data={this.state.stats}>
						<Bar type="natural" dot={false} dataKey='v' label={false}/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		);
	}
}

export default SlackStats

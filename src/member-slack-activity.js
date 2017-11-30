import React, { Component } from 'react';
import { ResponsiveContainer, BarChart, Bar } from 'recharts';
import Moment from 'moment-timezone'

class SlackStats extends Component {
	componentWillMount = () => {
		this.setState({
			member: false,
			stats: false,
			tz: Moment.tz.guess(),
		})
	}
	emptyLast = () => {
		var m = Moment().utc()
		var rval = {}
		for ( var i=0; i<this.props.state.days; i++ ) {
			if ( i > 0 ) {
				m.subtract(24, "hour")
			}
			rval[Moment.tz(m.format(), this.state.tz).format('YYYY-MM-DD')] = {
				name: Moment.tz(m.format(), this.state.tz).format('YYYY-MM-DD'),
				l: m.format('YYYY-MM-DDT00:00:00') + "Z",
				v: 0,
			}
		}
		return rval
	}
	processDaily = (json) => {
		var d = this.emptyLast()
		var data = []
		for (var i in d) {
			if ( typeof json[this.props.member.ID][32][d[i].l] !== "undefined" ) {
				d[i].v += json[this.props.member.ID][32][d[i].l]
			}
			data.push(d[i])
		}
		data.reverse()
		this.setState({stats: data})
	}
	componentDidUpdate = () => {
		if ( this.state.member !== this.props.member.ID ) {
			this.setState({member: this.props.member.ID, stats: false})
			this.props.state.api.stats.daily(this.props.member.ID, 32, this.props.state.days)
				.then(this.processDaily)
		}
	}
	render = () => {
		if ( this.state.stats === false ) {
			return null
		}
		return (
			<div className="my-1 text-center">
				<h6>Recent Slack Activity ({this.props.state.days} days)</h6>
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

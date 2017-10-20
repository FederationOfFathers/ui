import React, { Component } from 'react';

class First extends Component {
	componentWillMount = () => {
		this.setState({
			days: 7,
			top: 6,
			stats: false,
			fetching: false,
		})
	}
	componentDidUpdate = () => {
		if ( this.state.fetching === false ) {
			this.setState({fetching: "stats"})
			this.props.state.api.raw.fetch('xhr/stats/v1/slack/activity/last-' + this.state.days + '.json')
				.then(function(response) {
					return response.json()
				})
				.then(function(json) {
					var data = []
					var channels = Object.keys(json)
					var max = 0
					for ( var channel in channels ) {
						var days = Object.keys(json[channels[channel]])
						var sum = 0
						for ( var day in days ) {
							sum += json[channels[channel]][days[day]]
						}
						if ( sum > max ) {
							max = sum
						}
						data.push({name: channels[channel], v: sum})
					}
					data.sort(function(a, b) {
						if (a.v < b.v) {
							return -1
						}
						if (a.v > b.v) {
							return 1
						}
						return 0
					})
					var final = []
					for ( var i=0; i<this.state.top; i++ ) {
						final.push(data.pop())
						final[i].pct = Math.round((final[i].v / max) * 100)
					}
					this.setState({stats: final})
				}.bind(this))
		}
	}
	bar = () => {
		if ( this.state.stats === false ) {
			return null
		}
		var rval = []
		for ( var i in this.state.stats ) {
			rval.push((
				<div key={i} className="float-left w-50 my-1 mx-0 py-0 px-1">
					<span style={{fontSize: "0.75em"}}>{this.state.stats[i].name}</span>
					<div className="progress">
						<div className="progress-bar" style={{
							width: this.state.stats[i].pct + "%",
							overflow: "elipses",
						}}role="progressbar">
						{this.state.stats[i].v.toLocaleString()}
					</div>
				</div>
			</div>
			))
		}
		return (
			<div className="clearfix">
				<div className="text-center">
					<h6>Most active channels</h6>
					<h6>Over the last {this.state.days} days</h6>
				</div>
				{rval}
			</div>
		)
	}
	render = () => {
		return (
			<div>
				{this.bar()}
			</div>
		)
	}
}

export default First

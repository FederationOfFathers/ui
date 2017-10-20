import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

class ChannelStats extends Component {
	componentWillMount = () => {
		this.setState({
			stats: false,
			days: 60,
		})
		this.props.state.api.raw.fetch('xhr/stats/v1/slack/activity/last-' + 60 + '.json')
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				for ( var key in json ) {
					var data = []
					for ( var day in json[key] ) {
						data.push({ name: day, value: json[key][day] })
					}
					json[key] = data
				}
				this.setState({stats: json})
			}.bind(this))
	}
	merge = () => {
		var list = [];
		for ( var c in this.props.state.chanList ) {
			list.push({
				sortname: this.props.state.chanList[c].name.replace(/[^a-zA-Z0-9]/, ""),
				raw: this.props.state.chanList[c],
				is: "channel",
				member: (this.props.state.chanList[c].members.indexOf(this.props.state.user.name) >= 0),
			})
		}
		for ( var g in this.props.state.groupList ) {
			var isMember = (this.props.state.groupList[g].members.indexOf(this.props.state.user.name) >= 0)
			if ( isMember === false && this.props.state.admin === false && this.props.state.groupList[g].visible !== "true" ) {
				continue
			}
			list.push({
				sortname: this.props.state.groupList[g].name.replace(/[^a-zA-Z0-9]/, ""),
				raw: this.props.state.groupList[g],
				is: "group",
				member: isMember,
			})
		}
		list.sort(function(a,b) {
			if (a.sortname < b.sortname)
				return -1;
			if (a.sortname > b.sortname)
				return 1;
			return 0;
		})
		return list
	}
	groups = () => {
		var list = this.merge()
		var elements = [];
		for ( var i in list ) {
			var classes = "list-group-item clearfix"

			if ( list[i].member === true ) {
				classes = classes + " list-group-item-primary"
			} else {
				classes = classes + " list-group-item-secondary"
			}

			var prefix = ""
			if ( list[i].is === "channel" ) {
				prefix = "#"
			} else {
				continue
			}

			var graph = null
			if ( this.state.stats !== false && list[i].is === "channel" ) {
				graph = (
					<ResponsiveContainer className="float-right" width="50%" height={25} margin={{top: 0, right: 0, left: 0, bottom: 0}}>
						<LineChart data={this.state.stats[list[i].raw.name]}>
							<Line type="natural" dot={false} dataKey='value' label={false}/>
						</LineChart>
					</ResponsiveContainer>
				)
			}
			elements.push((
				<li key={list[i].raw.name} className={classes}>
					{graph}
					{prefix}{list[i].raw.name}
				</li>
			))
		}
		return elements
	}
	render() {
		return (
			<ul className="list-group">
				{this.groups()}
			</ul>
		);
	}
}

export default ChannelStats

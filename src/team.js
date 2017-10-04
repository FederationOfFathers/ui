import React, { Component } from 'react';
import Channel from './team-channel'
import ChannelButton from './team-channel-button'
import moment from 'moment';
import InputMoment from 'input-moment';
import './input-moment.css'

class Host extends Component {
        change = ( m ) => {
                console.log(m)
                console.log(this.props.state)
                this.props.state.callbacks.team.setHostMoment( m );
        }
        save = () => {
                console.log(this.props.state.raidHost.m.format('llll'))
        }
        stateComponentWillMount = () => {
                this.change( moment() )
        }
        render = () => {
                var channels = []
                for ( var cID in this.props.state.channels ) {
                        channels.push(<option>{this.props.state.channels[cID].name}</option>)
                }
                return (
                        <div className="form-group">
                                <div className="my-2 mx-4">
                                        <label htmlFor="echan">Event Channel</label>
                                        <select className="form-control" id="echan">
                                                {channels}
                                        </select>
                                </div>

                                <div className="my-2 mx-4">
                                        <label htmlFor="ename">Event Name</label>
                                        <input type="test" id="ename" className="form-control" placeholder="Event Name"/>
                                </div>

                                <div className="my-2">
                                        <label htmlFor="ets" className="mx-4">Event Date &amp; Time</label>
                                        <div style={{textAlign: "center"}}>
                                                <InputMoment
                                                        moment={this.props.state.raidHost.m}
                                                        onChange={this.change}
                                                        onSave={this.save}
                                                        minStep={5}
                                                        />
                                        </div>
                                </div>
                        </div>
                )
        }
}

class Team extends Component {
        channelButtons = () => {
                var rval = []
                var raids = this.props.state.raids.raids
                for ( var cName in raids ) {
                        var cRaidKeys = Object.keys(raids[cName])
                        if ( cRaidKeys.length < 1 ) {
                                continue
                        }
                        rval.push((
                                <ChannelButton key={cName} keys={cRaidKeys} name={cName} data={raids[cName]} state={this.props.state}/>
                        ))
                }
                return rval
        }
        channel = () => {
                var myChan = this.props.state.vars.chan
                if ( typeof myChan === "undefined" || myChan === "" ) {
                        return null
                }
                var myRaids = this.props.state.raids.raids[myChan]
                if ( typeof myRaids === "undefined" ) {
                        return null
                }
                var cRaidKeys = Object.keys(myRaids)
                if ( cRaidKeys.length < 1 ) {
                        return null
                }
                return (
                        <Channel key={myChan} keys={cRaidKeys} name={myChan} data={myRaids} state={this.props.state}/>
                )
        }
        host = () => {
                return (<Host state={this.props.state}/>)
        }
        render = () => {
                if ( this.props.state.navHeight < 1 ) {
                        return(<div/>)
                }
                if ( this.props.state.vars.raid === "host" ) {
                        return this.host()
                }
                return (
                        <div className="team container container-fluid">
                                <div className="row">
                                        <div className="col">
                                                <div className="btn-group-vertical w-100">{this.channelButtons()}</div>
                                        </div>
                                </div>
                                <div className="row">
                                        <div className="col">
                                        {this.channel()}
                                        </div>
                                </div>
                        </div>
                );
        }
}

export default Team

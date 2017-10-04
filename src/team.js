import React, { Component } from 'react';
import Channel from './team-channel'
import ChannelButton from './team-channel-button'
import moment from 'moment';
import InputMoment from 'input-moment';
import './input-moment.css'

class Host extends Component {
        componentWillMount = () => {
                var initialMoment = moment()
                var initialOffMinutes = initialMoment.get('minute') % 5
                if ( initialOffMinutes !== 0 ) {
                        initialMoment.set( 'minute', initialMoment.get('minute') + ( 5 - initialOffMinutes ) )
                }
                var maxDays = 14
                if ( this.props.state.admin === true ) {
                        maxDays = 365
                }
                this.setState({
                        title: "",
                        channel: "",
                        m: initialMoment,
                        now: moment(initialMoment),
                        max: moment().add(maxDays, 'days'),
                })
        }
        changeChannel = ( e ) => {
                this.setState({channel: e.target.value})
        }
        changeTitle = ( e ) => {
                this.setState({title: e.target.value})
        }
        changeMoment = ( m ) => {
                this.setState({m: m})
        }
        save = () => {
                console.log(this.state)
        }
        stateComponentWillMount = () => {
                this.change( moment() )
        }
        errors = () => {
                var rval = {
                        Moment: false,
                        MomentGood: false,
                        Title: false,
                        Chan: false,
                }
                if ( this.state.channel === "" ) {
                        rval.Chan = (<div className="alert alert-danger">Pick a channel</div>)
                }
                if ( this.state.title.length < 5 ) {
                        rval.Title = (<div className="alert alert-danger">Title must be more substantial</div>)
                }
                if ( this.state.now.isAfter( this.state.m ) ) {
                        rval.Moment = (<div className="mx-4 alert alert-danger">Be <strong>after</strong> {moment().format('llll')}</div>)
                } else if ( this.state.m.isAfter( this.state.max ) ) {
                        rval.Moment = (<div className="mx-4 alert alert-danger">Be <strong>before</strong> {this.state.max.format('llll')}</div>)
                } else {
                        rval.MomentGood = (<div className="mx-4 alert alert-success">Event Time: {this.state.m.format('llll')}</div>)
                }
                return rval
        }
        render = () => {
                var err = this.errors()
                var channels = [
                        (<option key="none" value="">Select A Channel</option>)
                ]
                for ( var cID in this.props.state.channels ) {
                        channels.push(<option key={cID}>{this.props.state.channels[cID].name}</option>)
                }
                return (
                        <div className="form-group">
                                <form>
                                <div className="my-2 mx-4">
                                        {err.Chan || err.Title }
                                        <select onChange={this.changeChannel} className="form-control" id="echan">
                                                {channels}
                                        </select>
                                </div>

                                <div className="my-2 mx-4">
                                        <input
                                                value={this.state.title} 
                                                onChange={this.changeTitle} 
                                                type="text" id="ename" 
                                                className="form-control" 
                                                placeholder="Example Event Name"/>
                                </div>
                                </form>
                                <div className="my-2">
                                        { err.MomentGood || err.Moment }
                                        <div style={{textAlign: "center"}}>
                                                <InputMoment
                                                        moment={this.state.m}
                                                        onChange={this.changeMoment}
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

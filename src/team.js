import React, { Component } from 'react';

class Raid extends Component {
        members = () => {
                var rval = []
                for ( var i in this.props.data.members ) {
                        rval.push(<li key={"m-"+i} className="list-group-item-primary list-group-item">{this.props.data.members[i]}</li>)
                }
                return rval
        }
        alts = () => {
                var rval = []
                if ( this.props.data.alts !== null ) {
                        for ( var i in this.props.data.alts ) {
                                rval.push(
                                        <li key={"a-"+i} className="list-group-item list-group-item-secondary">
                                                {this.props.data.alts[i]}
                                        </li>
                                )
                        }
                }
                return rval
        }
        render = () => {
                return (
                        <ul className="list-group">
                        {this.members()}
                        {this.alts()}
                        </ul>
                )
        }
}

class RaidButton extends Component {
        click = () => {
                console.log("here " + this.props.data.uuid)
                this.props.state.hasher.set({raid: this.props.data.uuid})
        }
        shortName = () => {
                var name = this.props.data.name
                name = name.replace(/^\[[^]*\] /i, "")
                return name
        }
        render = () => {
                var alts = []
                if ( typeof this.props.data.alts !== "undefined" && this.props.data.alts !== null ) {
                        alts = this.props.data.alts
                }
                var buttonClass = "btn w-100"
                if ( this.props.state.vars.raid === this.props.data.uuid ) {
                        buttonClass = buttonClass + " btn-primary"
                }
                console.log({raidData: this.props.data})
                return (
                        <button className={buttonClass} style={{overflow: "hidden"}} onClick={this.click}>
                        <span className="float-left mx-1 badge badge-dark">{this.props.data.members.length + alts.length}</span>
                        {this.shortName()}
                        </button>
                )
        }
}

class Channel extends Component {
        click = () => {
                this.props.state.hasher.set({chan: this.props.name})
        }
        raidButtons = () => {
                if ( this.props.state.vars.chan !== this.props.name ) {
                        return null
                }
                var rval = []
                for ( var i in this.props.keys ) {
                        var key = this.props.keys[i]
                        rval.push(( <RaidButton key={key} id={key} data={this.props.data[key]} state={this.props.state}/> ))
                }
                return rval
        }
        raid = () => {
                if ( typeof this.props.state.vars.raid === "undefined" ) {
                        return null
                }
                var key = this.props.state.vars.raid
                if ( typeof this.props.data[key] === "undefined" ) {
                        return null
                }
                return (<Raid id={this.props.state.vars.raid} data={this.props.data[key]} state={this.props.state}/>)
        }
        render = () => {
                return (
                        <div>
                                <div className="btn-group-vertical w-100 my-2">
                                        {this.raidButtons()}
                                </div>
                        {this.raid()}
                        </div>
                )
        }
}

class ChannelButton extends Component {
        click = () => {
                this.props.state.hasher.set({chan: this.props.name})
        }
        render = () => {
                var btnClass = "btn w-100"
                if ( this.props.state.vars.chan === this.props.name ) {
                        btnClass = btnClass + " btn-primary"
                }
                return (
                        <button className={btnClass} onClick={this.click} style={{whiteSpace: "nowrap"}}>
                                #{this.props.name} <span className="float-left mx-1 badge badge-dark">{this.props.keys.length}</span>
                        </button>
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
                console.log(">>", myRaids)
                var cRaidKeys = Object.keys(myRaids)
                if ( cRaidKeys.length < 1 ) {
                        return null
                }
                return (
                        <Channel key={myChan} keys={cRaidKeys} name={myChan} data={myRaids} state={this.props.state}/>
                )
        }
        render = () => {
                if ( this.props.state.navHeight < 1 ) {
                        return(<div/>)
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

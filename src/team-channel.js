import React, { Component } from 'react';
import RaidButton from './team-raid-button'
import Raid from './team-raid';

class Channel extends Component {
        click = () => {
                this.props.state.hasher.set({chan: this.props.name})
        }
        raidButtons = () => {
                if ( this.props.state.vars.chan !== this.props.name ) {
                        return null
                }
                this.props.keys.sort(function(a,b) {
                        if (this.props.data[a].raid_time < this.props.data[b].raid_time)
                                return -1;
                        if (this.props.data[a].raid_time > this.props.data[b].raid_time)
                                return 1;
                        return 0;
                }.bind(this))
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
                                <div className="w-100 my-1">
                                        {this.raidButtons()}
                                </div>
                        {this.raid()}
                        </div>
                )
        }
}

export default Channel

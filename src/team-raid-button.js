import React, { Component } from 'react';

class RaidButton extends Component {
        click = () => {
                if ( this.props.state.vars.raid !== this.props.data.uuid ) {
                        this.props.state.hasher.set({raid: this.props.data.uuid})
                } else {
                        this.props.state.hasher.set({raid: null})
                }
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
                var buttonClass = "my-1 btn w-100"
                var close = null
                if ( this.props.state.vars.raid === this.props.data.uuid ) {
                        buttonClass = buttonClass + " btn-primary"
                        close = (
                                <span className="float-right close" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                </span>
                        )
                } else {
                        if ( typeof this.props.state.vars.raid !== "undefined" && this.props.state.vars.raid !== null ) {
                                return null
                        }
                }
                var date = new Date(Date.parse(this.props.data.raid_time))
                return (
                        <button className={buttonClass} style={{overflow: "hidden"}} onClick={this.click}>{close}
                                {this.shortName()}
                                <br/>
                        <span className="mx-1 my-1 badge badge-dark">{date.toLocaleString('en-US')}</span>
                        <span className="mx-1 my-1 badge badge-secondary">{this.props.data.members.length + alts.length} member
                        {(this.props.data.members.length + alts.length) === 1 ? "" : "s" }
                        </span>
                        </button>
                )
        }
}

export default RaidButton

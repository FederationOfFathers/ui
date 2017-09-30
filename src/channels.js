import React, { Component } from 'react';

class Channels extends Component {
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
                        list.push({
                                sortname: this.props.state.groupList[g].name.replace(/[^a-zA-Z0-9]/, ""),
                                raw: this.props.state.groupList[g],
                                is: "group",
                                member: (this.props.state.groupList[g].members.indexOf(this.props.state.user.name) >= 0),
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
                        var classes = "list-group-item"
                        var button = []

                        if ( list[i].is == "channel" ) {
                                if ( list[i].member === true ) {
                                        button.push((<button key="part" className="btn btn-secondary float-right">part</button>))
                                        classes = classes + " list-group-item-primary"
                                } else {
                                        button.push((<button key="join" className="btn btn-primary float-right">join</button>))
                                        classes = classes + " list-group-item-secondary"
                                }
                        } else {
                                if ( list[i].member === true ) {
                                        button.push((<button key="part" className="btn btn-secondary float-right">part</button>))
                                        classes = classes + " list-group-item-primary"
                                } else {
                                        if ( list[i].raw.visible === "true" ) {
                                                button.push((<button key="join" className="btn btn-primary float-right">join</button>))
                                        }
                                        classes = classes + " list-group-item-secondary"
                                }
                                if ( this.props.state.admin === true ) {
                                        button.push((<button key="visi" className="btn btn-warning float-right">visibility</button>))
                                }
                        }

                        var prefix = ""
                        if ( list[i].is === "channel" ) {
                                prefix = "#"
                        }
                        elements.push((
                                <li key={list[i].raw.name} className={classes}>{prefix}{list[i].raw.name} {button}</li>
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

export default Channels

import { Component } from 'react';

import Hash from 'hash-handler';

const hash = Hash();

class State extends Component {
        stateComponentWillMount = () => {
                this.setState({
                        didPing: false,
                        loggedIn: false,
                        vars: hash.get(),
                        hasher: hash,
                        hashString: window.location.hash,
                        windowHeight: window.innerHeight,
                        windowWidth: window.innerWidth,
                        navHeight: 0,
                        setNavHeight: this.setNavHeight,
                        callbacks: {
                                slack: {
                                        join: this.joinSlack,
                                        part: this.partSlack,
                                },
                        },
                })
                hash.registerListener(this.hashChange);
                window.onresize = function() {
                        this.setState({
                                windowHeight: window.innerHeight,
                                windowWidth: window.innerWidth,
                        })
                }.bind(this)
        }
        joinSlack = (id, kind) => {
                console.log("join " + id + " " + kind)
        }
        partSlack = (id, kind) => {
                console.log("part " + id + " " + kind)
        }
        setNavHeight = ( height ) => {
                this.setState({ navHeight: height })
        }
        hashChange = () => {
                this.setState({
                        vars: this.state.hasher.get(),
                        hashString: window.location.hash,
                })
        }
        save = () => {
                localStorage.setItem("fofstate", JSON.stringify(this.state));
        }
        load = () => {
                var value = JSON.parse(localStorage.getItem("fofstate"));
                if ( "object" !== typeof value ) {
                        return
                }
                if ( value === null ) {
                        return
                }
                value.hasher = hash
                value.vars = hash.get()
                value.hashString = window.location.hash
                value.callbacks = {
                        slack: {
                                join: this.joinSlack,
                                part: this.partSlack,
                        },
                };
                this.setState(value)
        }
}

export default State

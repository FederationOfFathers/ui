import { Component } from 'react';
import moment from 'moment';
import Hash from 'hash-handler';

const hash = Hash();

class State extends Component {
        callbacks = () => {
                return { 
                        'team': {
                                setHostMoment: this.setHostMoment,
                        },
                }
        }
        stateComponentWillMount = () => {
                this.setState({
                        raidbotToken: false,
                        raids: {},
                        raidHost: {
                                m: moment(),
                                title: "",
                        },
                        didPing: false,
                        loggedIn: false,
                        vars: hash.get(),
                        hasher: hash,
                        hashString: window.location.hash,
                        windowHeight: window.innerHeight,
                        windowWidth: window.innerWidth,
                        navHeight: 0,
                        setNavHeight: this.setNavHeight,
                        callbacks: this.callbacks(),
                })
                this.callbacks();
                hash.registerListener(this.hashChange);
                window.onresize = function() {
                        this.setState({
                                windowHeight: window.innerHeight,
                                windowWidth: window.innerWidth,
                        })
                }.bind(this)
        }
        setHostMoment = ( m ) => {
                var host = this.state.raidHost
                host.m = m
                this.setState({raidhost: host})
                this.save()
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
                value.callbacks = this.callbacks();
                value.raidHost = {
                        m: moment(),
                        title: "",
                }
                this.setState(value)
        }
}

export default State

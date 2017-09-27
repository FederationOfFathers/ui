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
                })
                hash.registerListener(this.hashChange);
        }
        hashChange = () => {
                this.setState({
                        vars: this.state.hasher.get(),
                        hashString: window.location.hash,
                })
        }
}

export default State

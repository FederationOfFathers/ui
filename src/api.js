import 'whatwg-fetch'
import State from './state.js'

class Api extends State {
        apiComponentWillMount = () => {
                this.load()
                this.ping()
        }
        url = ( part ) => {
                return "//dashboard.fofgaming.com/api/v0/" + part
        }
        fetch = ( what ) => {
                if ( what.substring(0, 2) !== "//" ) {
                        what = this.url( what );
                }
                return fetch(what, { credentials: 'include' })
        }
        channels = () => {
                this.fetch("channels")
                .then(function(response) {
                        return response.json()
                }).then(function(json) {
                        this.setState({chanList: json})
                        this.save()
                }.bind(this))
        }
        groups = () => {
                this.fetch("groups")
                .then(function(response) {
                        return response.json()
                }).then(function(json) {
                        this.setState({groupList: json})
                        this.save()
                }.bind(this))
        }
        ping = () => {
                this.fetch( "ping" )
                .then(function(response) {
                        return response.json()
                })
                .then(function(json) {
                        if ( typeof json.user === "undefined" ) {
                                this.setState({loggedIn: false})
                                return
                        }
                        if ( json.user === null ) {
                                this.setState({loggedIn: false})
                                return
                        }
                        json.didPing = true
                        json.loggedIn = true
                        this.setState(json)
                        this.channels()
                        this.groups()
                        this.save()
                }.bind(this))
                .catch(function(ex) {
                        this.setState({
                                didPing: false,
                                loggedIn: false,
                        })
                }.bind(this))
        }
}

export default Api

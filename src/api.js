import 'whatwg-fetch'
import State from './state.js'

class Api extends State {
        apiComponentWillMount = () => {
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
        ping = () => {
                this.fetch( "ping" )
                .then(function(response) {
                        return response.json()
                })
                .then(function(json) {
                        if ( typeof json.user === "undefined" ) {
                                return
                        }
                        json.didPing = true
                        json.loggedIn = true
                        this.setState(json)
                }.bind(this))
        }
}

export default Api

export default {

	noAt: function( input ) {
		return input.replace(/^@/, '')
	},

	noSocial: function( input ) {
		input = input.replace(/^(www\.)?(twitter|instagram|mixer|beam)\.com\/?/i, '')
		input = input.replace(/^(go\.)?twitch\.(tv|com)\/?/i, '')
		return input
	},

	noHTTP: function( input ) {
		return input.replace(/^https?:\/\//, '')
	},

	social: function( input ) {
		return this.noAt( this.noSocial( this.noHTTP( input ) ) );
	},

}

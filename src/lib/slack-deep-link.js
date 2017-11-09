export default {
	team_id: "T0381RKM5",
	bot_id: "U1CR4ML94",
	help_channel_id: "C3GQM9N9H",
	bot: function() {
		return this.link("user", this.bot_id)
	},
	help: function() {
		return this.link("channel", this.help_channel_id)
	},
	link: function(kind, id) {
		return 'slack://'+kind+'?team='+this.team_id+'&id='+id
	},
}

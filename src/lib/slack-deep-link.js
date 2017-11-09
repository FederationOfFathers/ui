export default {
	team_id: "T0381RKM5",
	bot_id: "U1CR4ML94",
	help_channel_id: "C3GQM9N9H",
	bot: function() {
		return 'slack://channel?team='+this.team_id+'&id='+this.bot_id
	},
	help: function() {
		return 'slack://channel?team='+this.team_id+'&id='+this.help_channel_id
	},
	link: function(id) {
		return 'slack://channel?team='+this.team_id+'&id='+id
	},
}

var fetch = require('node-fetch');

console.log("Running deploy. Some notes:\n\n")

console.log("This only deploys pushed commits.\n\n")

console.log("Both dev.fofgaming.com and ui.fofgaming.com")
console.log("run in production mode, just off of the dev")
console.log("and master branches respectively. You will")
console.log("almost certainly want to make a build and")
console.log("commit it before deploying.\n\n")

fetch("http://dev.fofgaming.com/deploy.php")
	.then(function(response) {
		return response.text();
	}).then(function(response) {
		console.log("--[ Deploy ][ DEV ][ SUCCESS ]--")
		console.log(response)
	})
	.catch(function() {
		console.log("--[ Deploy ][ DEV ][ FAILURE ]--")
		console.log(response)
	})

fetch("http://ui.fofgaming.com/deploy.php")
	.then(function(response) {
		return response.text();
	}).then(function(response) {
		console.log("--[ Deploy ][ PRODUCTION ][ SUCCESS ]--")
		console.log(response)
	})
	.catch(function() {
		console.log("--[ Deploy ][ PRODUCTION ][ FAILURE ]--")
		console.log(response)
	})

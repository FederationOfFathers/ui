module.exports = function override(config, env){
	
	// disable chunks for now. code splitting would require nginx updates
	config.optimization.splitChunks = false
	config.optimization.runtimeChunk = false
 
	return config;
}

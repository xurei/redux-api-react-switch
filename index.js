const containers = require('./src/react-prop-switch-containers');

module.exports = {
	Switch: require('./src/react-prop-switch'),
	Init: containers.Init,
	FirstFetch: containers.FirstFetch,
	NextFetch: containers.NextFetch,
	Fetched: containers.Fetched,
	Error: containers.Error,
	
	AnyFetch: containers.AnyFetch,
	FetchedOnce: containers.FetchedOnce,
	NotFetched: containers.NotFetched,
};

const React = require('react');
import { func } from 'prop-types';

class PropSwitchGenericContainer extends React.Component {
	componentDidMount() {
		if (!!this.props.onMount) {
			this.props.onMount();
		}
	}
	componentWillUnmount() {
		if (!!this.props.onUnmount) {
			this.props.onUnmount();
		}
	}
	render() {
		return (
			<div style={Object.assign({display: 'block'}, this.props.style)}>
				{this.props.children}
			</div>
		);
	}
}

PropSwitchGenericContainer.propTypes = {
	onMount: func,
	onUnmount: func
};

//Atomic Containers
class PropSwitchInit extends PropSwitchGenericContainer {}
PropSwitchInit.isMatching = (prop) => (!prop.error && prop.sync === false && prop.loading === false);

class PropSwitchFirstFetch extends PropSwitchGenericContainer {}
PropSwitchFirstFetch.isMatching = (prop) => (!prop.error && prop.sync === false && prop.loading === true);

class PropSwitchNextFetch extends PropSwitchGenericContainer {}
PropSwitchNextFetch.isMatching = (prop) => (!prop.error && prop.sync === true && prop.loading === true);

class PropSwitchFetched extends PropSwitchGenericContainer {}
PropSwitchFetched.isMatching = (prop) => (!prop.error && prop.sync === true && prop.loading === false);

class PropSwitchError extends PropSwitchGenericContainer {}
PropSwitchError.isMatching = (prop) => (!!prop.error);

//Combined Containers
//Init+FirstFetch = NotFetched
class PropSwitchNotFetched extends PropSwitchGenericContainer {}
PropSwitchNotFetched.isMatching = (prop) => PropSwitchInit.isMatching(prop) || PropSwitchFirstFetch.isMatching(prop);

//FirstFetch+NextFetch = AnyFetch
class PropSwitchAnyFetch extends PropSwitchGenericContainer {}
PropSwitchAnyFetch.isMatching = (prop) => PropSwitchFirstFetch.isMatching(prop) || PropSwitchNextFetch.isMatching(prop);

//Fetched+NextFetch = FetchedOnce
class PropSwitchFetchedOnce extends PropSwitchGenericContainer {}
PropSwitchFetchedOnce.isMatching = (prop) => PropSwitchFetched.isMatching(prop) || PropSwitchNextFetch.isMatching(prop);

module.exports = {
	Init: PropSwitchInit,
	FirstFetch: PropSwitchFirstFetch,
	NextFetch: PropSwitchNextFetch,
	Fetched: PropSwitchFetched,
	Error: PropSwitchError,
	
	AnyFetch: PropSwitchAnyFetch,
	FetchedOnce: PropSwitchFetchedOnce,
	NotFetched: PropSwitchNotFetched,
};

const React = require('react');
import { func } from 'prop-types';

class PropSwitchGenericContainer extends React.Component {
	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount();
		}
	}
	componentWillUnmount() {
		if (this.props.onUnmount) {
			this.props.onUnmount();
		}
	}
	render() {
		return (
			<div style={this.props.style}>
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
class Init extends PropSwitchGenericContainer {}
Init.isMatching = (prop) => (!prop.error && prop.sync === false && prop.loading === false);

class FirstFetch extends PropSwitchGenericContainer {}
FirstFetch.isMatching = (prop) => (!prop.error && prop.sync === false && prop.loading === true);

class NextFetch extends PropSwitchGenericContainer {}
NextFetch.isMatching = (prop) => (!prop.error && prop.sync === true && prop.loading === true);

class Fetched extends PropSwitchGenericContainer {}
Fetched.isMatching = (prop) => (!prop.error && prop.sync === true && prop.loading === false);

class Error extends PropSwitchGenericContainer {}
Error.isMatching = (prop) => (!!prop.error);

//Combined Containers
//Init+FirstFetch = NotFetched
class NotFetched extends PropSwitchGenericContainer {}
NotFetched.isMatching = (prop) => Init.isMatching(prop) || FirstFetch.isMatching(prop);

//FirstFetch+NextFetch = AnyFetch
class AnyFetch extends PropSwitchGenericContainer {}
AnyFetch.isMatching = (prop) => FirstFetch.isMatching(prop) || NextFetch.isMatching(prop);

//Fetched+NextFetch = FetchedOnce
class FetchedOnce extends PropSwitchGenericContainer {}
FetchedOnce.isMatching = (prop) => Fetched.isMatching(prop) || NextFetch.isMatching(prop);

//Fetched+NextFetch+Error = FetchedOnceOrError = AnyResult
class FetchedOnceOrError extends PropSwitchGenericContainer {}
FetchedOnceOrError.isMatching = (prop) => FetchedOnce.isMatching(prop) || Error.isMatching(prop);

module.exports = {
	Init: Init,
	FirstFetch: FirstFetch,
	NextFetch: NextFetch,
	Fetched: Fetched,
	Error: Error,
	
	AnyFetch: AnyFetch,
	FetchedOnce: FetchedOnce,
	NotFetched: NotFetched,
	FetchedOnceOrError: FetchedOnceOrError,
	AnyResult: FetchedOnceOrError,
};

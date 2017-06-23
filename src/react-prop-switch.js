const React = require('react');

import { Init, FirstFetch, Fetched, NextFetch,
	AnyFetch, NotFetched, FetchedOnce, FetchedOnceOrError, AnyResult,
	Error as PropError } from './react-prop-switch-containers';

class PropSwitch extends React.Component {
	render() {
		const itemsToRender = [];
		
		for (var ch of React.Children.toArray(this.props.children)) {
			if (ch.type.isMatching(this.props.state)) {
				itemsToRender.push(ch);
			}
		}
		
		if (!!this.props.state.error && itemsToRender.length===0) {
			itemsToRender.push(<div key='err' style={{display:'block'}}>{JSON.stringify(this.props.state.error)}</div>);
		}
		
		return (
			<div>
				{itemsToRender}
			</div>
		);
	}
}

const acceptedElements = [
	Init,
	FirstFetch,
	NextFetch,
	Fetched,
	
	AnyFetch,
	NotFetched,
	FetchedOnce,
	
	FetchedOnceOrError,
	AnyResult,
	
	PropError,
];

PropSwitch.propTypes = {
	state: (props, propName, componentName) => {
		const prop = props[propName];
		if (typeof(prop) !== 'object') {
			return new Error(`<${componentName}> requires the prop \`${propName}\``);
		}
		else {
			if (typeof(prop.error) === 'undefined' || !prop.error) {
				if (typeof(prop.loading) === 'undefined' || typeof(prop.sync) === 'undefined') {
					return new Error(`<${componentName}> requires the prop \`${propName}\` to have \`loading\` and \`sync\` fields`);
				}
			}
		}
		return null;
	},
	
	children: (props, propName, componentName) => {
		const out = React.Children.toArray(props[propName])
		.find(child => !acceptedElements.find((element) => (child.type === element)))
		&& new Error(`<${componentName}> only accepts these elements : <Init>, <FirstFetch>, <Fetched>, <NextFetch>, <Error>`);
		return out;
	},
};

module.exports = PropSwitch;

const React = require('react');

import { Init, FirstFetch, Fetched, NextFetch,
	AnyFetch, NotFetched, FetchedOnce, FetchedOnceOrError, AnyResult,
	Error as PropError } from './react-prop-switch-containers';

class PropSwitch extends React.Component {
	render() {
		const itemsToRender = [];
		const state = mergeStates(this.props.state);
		
		for (var ch of React.Children.toArray(this.props.children)) {
			if (ch.type.isMatching(state)) {
				itemsToRender.push(ch);
			}
		}
		
		if (!!state.error && itemsToRender.length===0) {
			itemsToRender.push(<div key={`err-${itemsToRender.length}`}>{JSON.stringify(state.error)}</div>);
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

function mergeStates(states) {
	if (!Array.isArray(states)) {
		return states;
	}
	else {
		const out = {
			loading: false,
			sync: true,
			error: null
		};
		states.forEach(state => {
			out.loading |= state.loading;
			out.sync &= state.sync;
			if (state.error && !out.error) {
				out.error = state.error;
			}
		});
		out.loading = Boolean(out.loading);
		out.sync = Boolean(out.sync);
		return out;
	}
}

function checkStateSchema(prop, propName, componentName) {
	if (typeof(prop) !== 'object' || Array.isArray(prop)) {
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
}

PropSwitch.propTypes = {
	state: (props, propName, componentName) => {
		const prop = props[propName];
		
		if (Array.isArray(prop)) {
			const errors = (
				prop
				.map(substate => checkStateSchema(substate, propName, componentName))
				.filter(r => r !== null)
			);
			if (errors.length > 0) {
				return new Error(`<${componentName}> requires the prop \`${propName}\` to be an array of objects having \`loading\` and \`sync\` fields`);
			}
		}
		else {
			return checkStateSchema(prop, propName, componentName);
		}
		return null;
	},
	
	children: (props, propName, componentName) => {
		return (
			React.Children.toArray(props[propName])
			.find(child => !acceptedElements.find((element) => (child.type === element)))
		) && new Error(`<${componentName}> only accepts these elements : <Init>, <FirstFetch>, <Fetched>, <NextFetch>, <Error>`);
	},
};

module.exports = PropSwitch;

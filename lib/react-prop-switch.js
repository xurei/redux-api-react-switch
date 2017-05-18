const React = require('react');
const PropTypes = require('prop-types');

import { Init, FirstFetch, Fetched, NextFetch, Error as PropError } from './react-prop-switch-containers';

class PropSwitch extends React.Component {
	componentDidMount() {
	}
	
	render() {
		const itemsToRender = [];
		
		//Find the best match
		for (var ch of React.Children.toArray(this.props.children)) {
			if (ch.type.isMatching(this.props.prop)) {
				itemsToRender.push(ch);
			}
		}
		
		if (!!this.props.prop.error && itemsToRender.length===0) {
			itemsToRender.push(<div key='err' style={{display:'block'}}>{JSON.stringify(this.props.prop.error)}</div>);
		}
		
		return (
			<div>
				{itemsToRender}
			</div>
		);
	}
	
	shouldComponentUpdate(nextProps) {
		return JSON.stringify(this.props.prop) !== JSON.stringify(nextProps.prop);
	}
}

const acceptedElements = [
	Init,
	FirstFetch,
	NextFetch,
	Fetched,
	PropError
];

PropSwitch.propTypes = {
	prop: PropTypes.object.isRequired,
	children: (props, propName, componentName) => {
		const out = React.Children.toArray(props.children)
		.find(child => !acceptedElements.find((element) => (child.type === element)))
		&& new Error(`<${componentName}> only accepts these elements : <Init>, <FirstFetch>, <Fetched>, <NextFetch>, <Error>`);
		return out;
	},
};

module.exports = PropSwitch;

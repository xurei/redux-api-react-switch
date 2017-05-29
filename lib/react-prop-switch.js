'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactPropSwitchContainers = require('./react-prop-switch-containers');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var PropSwitch = function (_React$Component) {
	_inherits(PropSwitch, _React$Component);

	function PropSwitch() {
		_classCallCheck(this, PropSwitch);

		return _possibleConstructorReturn(this, (PropSwitch.__proto__ || Object.getPrototypeOf(PropSwitch)).apply(this, arguments));
	}

	_createClass(PropSwitch, [{
		key: 'render',
		value: function render() {
			var itemsToRender = [];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = React.Children.toArray(this.props.children)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var ch = _step.value;

					if (ch.type.isMatching(this.props.state)) {
						itemsToRender.push(ch);
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			if (!!this.props.state.error && itemsToRender.length === 0) {
				itemsToRender.push(React.createElement(
					'div',
					{ key: 'err', style: { display: 'block' } },
					JSON.stringify(this.props.state.error)
				));
			}

			return React.createElement(
				'div',
				null,
				itemsToRender
			);
		}
	}]);

	return PropSwitch;
}(React.Component);

var acceptedElements = [_reactPropSwitchContainers.Init, _reactPropSwitchContainers.FirstFetch, _reactPropSwitchContainers.NextFetch, _reactPropSwitchContainers.Fetched, _reactPropSwitchContainers.AnyFetch, _reactPropSwitchContainers.NotFetched, _reactPropSwitchContainers.FetchedOnce, _reactPropSwitchContainers.Error];

PropSwitch.propTypes = {
	state: function state(props, propName, componentName) {
		var prop = props[propName];
		if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) !== 'object') {
			return new Error('<' + componentName + '> requires the prop `' + propName + '`');
		} else {
			if (typeof prop.error === 'undefined' || !prop.error) {
				if (typeof prop.loading === 'undefined' || typeof prop.sync === 'undefined') {
					return new Error('<' + componentName + '> requires the prop `' + propName + '` to have `loading` and `sync` fields');
				}
			}
		}
		return null;
	},

	children: function children(props, propName, componentName) {
		var out = React.Children.toArray(props[propName]).find(function (child) {
			return !acceptedElements.find(function (element) {
				return child.type === element;
			});
		}) && new Error('<' + componentName + '> only accepts these elements : <Init>, <FirstFetch>, <Fetched>, <NextFetch>, <Error>');
		return out;
	}
};

module.exports = PropSwitch;
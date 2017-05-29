'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var PropSwitchGenericContainer = function (_React$Component) {
	_inherits(PropSwitchGenericContainer, _React$Component);

	function PropSwitchGenericContainer() {
		_classCallCheck(this, PropSwitchGenericContainer);

		return _possibleConstructorReturn(this, (PropSwitchGenericContainer.__proto__ || Object.getPrototypeOf(PropSwitchGenericContainer)).apply(this, arguments));
	}

	_createClass(PropSwitchGenericContainer, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (!!this.props.onMount) {
				this.props.onMount();
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (!!this.props.onUnmount) {
				this.props.onUnmount();
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ style: Object.assign({ display: 'block' }, this.props.style) },
				this.props.children
			);
		}
	}]);

	return PropSwitchGenericContainer;
}(React.Component);

PropSwitchGenericContainer.propTypes = {
	onMount: _propTypes.func,
	onUnmount: _propTypes.func
};

//Atomic Containers

var PropSwitchInit = function (_PropSwitchGenericCon) {
	_inherits(PropSwitchInit, _PropSwitchGenericCon);

	function PropSwitchInit() {
		_classCallCheck(this, PropSwitchInit);

		return _possibleConstructorReturn(this, (PropSwitchInit.__proto__ || Object.getPrototypeOf(PropSwitchInit)).apply(this, arguments));
	}

	return PropSwitchInit;
}(PropSwitchGenericContainer);

PropSwitchInit.isMatching = function (prop) {
	return !prop.error && prop.sync === false && prop.loading === false;
};

var PropSwitchFirstFetch = function (_PropSwitchGenericCon2) {
	_inherits(PropSwitchFirstFetch, _PropSwitchGenericCon2);

	function PropSwitchFirstFetch() {
		_classCallCheck(this, PropSwitchFirstFetch);

		return _possibleConstructorReturn(this, (PropSwitchFirstFetch.__proto__ || Object.getPrototypeOf(PropSwitchFirstFetch)).apply(this, arguments));
	}

	return PropSwitchFirstFetch;
}(PropSwitchGenericContainer);

PropSwitchFirstFetch.isMatching = function (prop) {
	return !prop.error && prop.sync === false && prop.loading === true;
};

var PropSwitchNextFetch = function (_PropSwitchGenericCon3) {
	_inherits(PropSwitchNextFetch, _PropSwitchGenericCon3);

	function PropSwitchNextFetch() {
		_classCallCheck(this, PropSwitchNextFetch);

		return _possibleConstructorReturn(this, (PropSwitchNextFetch.__proto__ || Object.getPrototypeOf(PropSwitchNextFetch)).apply(this, arguments));
	}

	return PropSwitchNextFetch;
}(PropSwitchGenericContainer);

PropSwitchNextFetch.isMatching = function (prop) {
	return !prop.error && prop.sync === true && prop.loading === true;
};

var PropSwitchFetched = function (_PropSwitchGenericCon4) {
	_inherits(PropSwitchFetched, _PropSwitchGenericCon4);

	function PropSwitchFetched() {
		_classCallCheck(this, PropSwitchFetched);

		return _possibleConstructorReturn(this, (PropSwitchFetched.__proto__ || Object.getPrototypeOf(PropSwitchFetched)).apply(this, arguments));
	}

	return PropSwitchFetched;
}(PropSwitchGenericContainer);

PropSwitchFetched.isMatching = function (prop) {
	return !prop.error && prop.sync === true && prop.loading === false;
};

var PropSwitchError = function (_PropSwitchGenericCon5) {
	_inherits(PropSwitchError, _PropSwitchGenericCon5);

	function PropSwitchError() {
		_classCallCheck(this, PropSwitchError);

		return _possibleConstructorReturn(this, (PropSwitchError.__proto__ || Object.getPrototypeOf(PropSwitchError)).apply(this, arguments));
	}

	return PropSwitchError;
}(PropSwitchGenericContainer);

PropSwitchError.isMatching = function (prop) {
	return !!prop.error;
};

//Combined Containers
//Init+FirstFetch = NotFetched

var PropSwitchNotFetched = function (_PropSwitchGenericCon6) {
	_inherits(PropSwitchNotFetched, _PropSwitchGenericCon6);

	function PropSwitchNotFetched() {
		_classCallCheck(this, PropSwitchNotFetched);

		return _possibleConstructorReturn(this, (PropSwitchNotFetched.__proto__ || Object.getPrototypeOf(PropSwitchNotFetched)).apply(this, arguments));
	}

	return PropSwitchNotFetched;
}(PropSwitchGenericContainer);

PropSwitchNotFetched.isMatching = function (prop) {
	return PropSwitchInit.isMatching(prop) || PropSwitchFirstFetch.isMatching(prop);
};

//FirstFetch+NextFetch = AnyFetch

var PropSwitchAnyFetch = function (_PropSwitchGenericCon7) {
	_inherits(PropSwitchAnyFetch, _PropSwitchGenericCon7);

	function PropSwitchAnyFetch() {
		_classCallCheck(this, PropSwitchAnyFetch);

		return _possibleConstructorReturn(this, (PropSwitchAnyFetch.__proto__ || Object.getPrototypeOf(PropSwitchAnyFetch)).apply(this, arguments));
	}

	return PropSwitchAnyFetch;
}(PropSwitchGenericContainer);

PropSwitchAnyFetch.isMatching = function (prop) {
	return PropSwitchFirstFetch.isMatching(prop) || PropSwitchNextFetch.isMatching(prop);
};

//Fetched+NextFetch = FetchedOnce

var PropSwitchFetchedOnce = function (_PropSwitchGenericCon8) {
	_inherits(PropSwitchFetchedOnce, _PropSwitchGenericCon8);

	function PropSwitchFetchedOnce() {
		_classCallCheck(this, PropSwitchFetchedOnce);

		return _possibleConstructorReturn(this, (PropSwitchFetchedOnce.__proto__ || Object.getPrototypeOf(PropSwitchFetchedOnce)).apply(this, arguments));
	}

	return PropSwitchFetchedOnce;
}(PropSwitchGenericContainer);

PropSwitchFetchedOnce.isMatching = function (prop) {
	return PropSwitchFetched.isMatching(prop) || PropSwitchNextFetch.isMatching(prop);
};

module.exports = {
	Init: PropSwitchInit,
	FirstFetch: PropSwitchFirstFetch,
	NextFetch: PropSwitchNextFetch,
	Fetched: PropSwitchFetched,
	Error: PropSwitchError,

	AnyFetch: PropSwitchAnyFetch,
	FetchedOnce: PropSwitchFetchedOnce,
	NotFetched: PropSwitchNotFetched
};
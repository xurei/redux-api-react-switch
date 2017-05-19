# redux-api-react-switch
[![npm](https://img.shields.io/npm/v/redux-api-react-switch.svg)](https://github.com/xurei/redux-api-react-switch)
[![Wercker](https://img.shields.io/wercker/ci/wercker/docs.svg)](https://app.wercker.com/xurei/redux-api-react-switch/runs)
[![Codecov](https://img.shields.io/codecov/c/github/xurei/redux-api-react-switch.svg)](https://github.com/xurei/redux-api-react-switch)
[![GitHub issues](https://img.shields.io/github/issues/xurei/redux-api-react-switch.svg)](https://github.com/xurei/redux-api-react-switch/issues)

Show different content based on the state of the resource

## Motivation

Using Redux with REST APIs is complicated. Depending on the state of the API call (pending, fetched, errored...), your UI might change.

This package helps you write your React components in a clear & readable way. 

It is meant to be used with [redux-api](https://www.npmjs.com/package/redux-api),
but it can be used with any other library.

## Usage
```jsx harmony
const React = require("react");
const ReactRedux = require('react-redux');

import { 
  Switch as PropSwitch, 
  Init, 
  FirstFetch, 
  Fetched,
  NextFetch,
  Error } from 'redux-api-react-switch';

class MyComponent extends React.Component {
  render() {
    return (
      <div>
        <PropSwitch state={this.props.rest_item}>
          <Init>Initial state, not pending</Init>
          <FirstFetch>First fetch pending</FirstFetch>
          <Fetched>Data fetched : {JSON.stringify(this.props.rest_item)}</Fetched>
          <NextFetch>Another fetch pending. Current data : {JSON.stringify(this.props.rest_item)}</NextFetch>
          <Error>An error occured : {JSON.stringify(this.props.rest_item.error)}</Error>
        </PropSwitch>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    rest_item: state.rest_item
    /*
    rest_item must have the structure below (from `redux-api`). 
    If your state doesn't provide this structure directly, you should adapt the object here
    {
      loading: Boolean,
      sync: Boolean,
      data: Object or undefined,
      error: Any
    }
    */
  }
}

module.exports = ReactRedux.connect(
  mapStateToProps
)(MyComponent);
```

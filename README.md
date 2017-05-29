# redux-api-react-switch
[![npm](https://img.shields.io/npm/v/redux-api-react-switch.svg)](https://github.com/xurei/redux-api-react-switch)
[![Wercker](https://img.shields.io/wercker/ci/wercker/docs.svg)](https://app.wercker.com/xurei/redux-api-react-switch/runs)
[![Codecov](https://img.shields.io/codecov/c/github/xurei/redux-api-react-switch.svg)](https://codecov.io/gh/xurei/redux-api-react-switch)
[![GitHub issues](https://img.shields.io/github/issues/xurei/redux-api-react-switch.svg)](https://github.com/xurei/redux-api-react-switch/issues)
[![Codacy grade](https://img.shields.io/codacy/grade/0667abf3801343e98de077f34f07819b.svg)](https://www.codacy.com/app/xurei/redux-api-react-switch)

A React+Redux component to work easily with REST states.

## Motivation

Using Redux with REST APIs is complicated. 
Depending on the state of the API call (pending, fetched, errored...), your UI should change.
Making it easy to read and understand can be complex. Also, as many component may rely on the same state variable, 
handling it inside each of them leads to many code redundancy. 

This package helps you use REST state variables in a more readable way and prevents code redundancy as much as possible. 

It is meant to be used with [redux-api](https://www.npmjs.com/package/redux-api),
but it can be used with any other library. See the example below.

## Usage
```jsx harmony
const React = require("react");
const ReactRedux = require('react-redux');

import { 
  Switch, 
  Init, 
  FirstFetch, 
  Fetched,
  NextFetch,
  Error } from 'redux-api-react-switch';

class MyComponent extends React.Component {
  render() {
    return (
      <div>
        <Switch state={this.props.rest_item}>
          <Init>Initial state, not pending</Init>
          <FirstFetch>First fetch pending</FirstFetch>
          <Fetched>Data fetched : {JSON.stringify(this.props.rest_item)}</Fetched>
          <NextFetch>Another fetch pending. Current data : {JSON.stringify(this.props.rest_item)}</NextFetch>
          <Error>An error occured : {JSON.stringify(this.props.rest_item.error)}</Error>
        </Switch>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    rest_item: state.rest_item
    /**
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

## Components

The Main component is `<Switch>`. 
It takes only one prop : `state`. 
It can only contains the subcomponent described below.

There are five "atomic" subcomponents : 
- `<Init>`       : The initial state. The data has not been fetched yet and no HTTP request is ongoing.
- `<FirstFetch>` : This state is shown when the first HTTP request is ongoing.
- `<Fetched>`    : The data has been fetched successfully. No HTTP request is ongoing.
- `<NextFetch>`  : The data has already been fetched, but a new HTTP request is ongoing.
- `<Error>`      : An error occured.

As a complement, there are also some "composite" subcomponents :
- `<NotFetched>`  === `<Init + FirstFetch>`
- `<AnyFetch>`    === `<FirstFetch + NextFetch>`
- `<FetchedOnce>` === `<Fetched + NextFetch>`

#### Events
Each subcomponent has the following events :
- `onMount()` : triggerred when the subcomponent is mounted.
- `onUnmount()` : triggerred when the subcomponent is unmounted.

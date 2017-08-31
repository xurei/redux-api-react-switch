/* eslint-disable no-undef */

import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, mount } from 'enzyme';
import sinonChai from 'sinon-chai';
chai.use(chaiEnzyme());
chai.use(sinonChai);
require('jsdom-global')();

import { Switch as PropSwitch, Init as PropInit, FirstFetch as PropFirstFetch, Fetched as PropFetched,
	NextFetch as PropNextFetch, FetchedOnce as PropFetchedOnce, AnyFetch as PropAnyFetch,
	NotFetched as PropNotFetched, AnyResult as PropAnyResult, FetchedOnceOrError as PropFetchedOnceOrError, Error as PropError } from '../src';

let console_error = console.error;
console.error = function(warning) {
	if (/(Invalid prop|Failed prop type)/.test(warning)) {
		throw new Error(warning);
	}
	console_error.apply(console, arguments);
};

describe('<PropSwitch/>', function() {
	describe('without `state`', function() {
		it('should throw', function(done) {
			//Execute + Verify
			expect(() => shallow(<PropSwitch>
				<PropError>test</PropError>
			</PropSwitch>)).to.throw(Error, 'requires the prop \`state\`');
			done();
		});
	});
	
	describe('with `state`', function() {
		it('should not throw', function(done) {
			//Execute + Verify
			shallow(<PropSwitch state={{loading:true, sync:false}}/>);
			done();
		});
	});
	
	describe('with invalid `state` format', function() {
		it('should throw an error', function(done) {
			//Execute
			const fn = () => {
				shallow(
					<PropSwitch state={{}}>
						<PropInit>test</PropInit>
						<PropError>test</PropError>
					</PropSwitch>
				);
			};
			
			//Verify
			expect(fn).to.throw(Error, 'requires the prop \`state\` to have \`loading\` and \`sync\` fields');
			done();
		});
	});
	
	describe('with `state.error` defined', function() {
		it('should render a default error when no <Error> block has been defined', function(done) {
			//Execute
			const component = shallow(<PropSwitch state={{error: 'This is an error'}}/>);
			//Verify
			expect(component).to.have.html('<div><div>&quot;This is an error&quot;</div></div>');
			done();
		});
		
		it('should render a custom error when a <Error> block has been defined', function(done) {
			//Prepare
			const state = {error: 'This is an error'};
			//Execute
			const component = shallow(
				<PropSwitch state={state}>
					<PropError>{state.error}</PropError>
				</PropSwitch>
			);
			//Verify
			expect(component).to.have.html('<div><div>This is an error</div></div>');
			done();
		});
	});
	
	describe('with `state.error` not defined and no child', function() {
		it('should not render anything', function(done) {
			//Execute
			const component = shallow(<PropSwitch state={{loading:true, sync:true}}/>);
			//Verify
			expect(component).to.have.html('<div></div>');
			done();
		});
	});
	
	describe('with an invalid child component', function() {
		it('should throw an error', function(done) {
			//Prepare
			const state = {error: 'This is an error'};
			
			//Execute
			const fn = () => {
				shallow(
					<PropSwitch state={state}>
						<div>I cannot do that</div>
					</PropSwitch>
				);
			};
			
			//Verify
			expect(fn).to.throw(Error, '<PropSwitch> only accepts these elements');
			done();
		});
	});
	
	describe('with all atomic children', function() {
		//Prepare + Execute
		const jsx = (state) => (
			<PropSwitch state={state}>
				<PropInit>init block</PropInit>
				<PropFirstFetch>first fetch</PropFirstFetch>
				<PropFetched>fetched</PropFetched>
				<PropNextFetch>nextFetch</PropNextFetch>
				<PropFetched>fetched 2</PropFetched>
				<PropError>error !!!</PropError>
			</PropSwitch>
		);
		const componentFF = shallow(jsx({loading:false, sync:false}));
		const componentTF = shallow(jsx({loading:true, sync:false}));
		const componentFT = shallow(jsx({loading:false, sync:true}));
		const componentTT = shallow(jsx({loading:true, sync:true}));
		const componentE  = shallow(jsx({loading:true, sync:true, error:'error'}));
		
		it('should render <Init> when data has not been fetched', function(done) {
			//Verify
			expect(componentFF).to.have.html('<div><div>init block</div></div>');
			done();
		});
		
		it('should render <FirstFetch> during the first fetch', function(done) {
			//Verify
			expect(componentTF).to.have.html('<div><div>first fetch</div></div>');
			done();
		});
		
		it('should render <PropFetched>\'s when data has been fetched', function(done) {
			//Verify
			expect(componentFT).to.have.html('<div><div>fetched</div><div>fetched 2</div></div>');
			done();
		});
		
		it('should render <NextFetch> during any non-first fetch', function(done) {
			//Verify
			expect(componentTT).to.have.html('<div><div>nextFetch</div></div>');
			done();
		});
		
		it('should render <Error> in case of error', function(done) {
			//Verify
			expect(componentE).to.have.html('<div><div>error !!!</div></div>');
			done();
		});
	});
	
	describe('with a subcomponent + onMount', function() {
		it('should call onMount once', function(done) {
			//Prepare
			let onMountCalled = 0;
			const component = mount(
				<PropSwitch state={{loading:true, sync:true}}>
					<PropFetched onMount={() => { onMountCalled++ }}>fetched</PropFetched>
				</PropSwitch>
			);
			expect(onMountCalled).to.eq(0);
			
			//Execute
			component.setProps({
				state: {loading:false, sync:true}
			});
			
			//Verify
			expect(onMountCalled).to.eq(1);
			done();
		});
	});
	
	describe('with a subcomponent + onUnmount', function() {
		it('should call onUnmount once', function(done) {
			//Prepare
			let onUnmountCalled = 0;
			const component = mount(
				<PropSwitch state={{loading:false, sync:true}}>
					<PropFetched onUnmount={() => { onUnmountCalled++ }}>fetched</PropFetched>
				</PropSwitch>
			);
			expect(onUnmountCalled).to.eq(0);
			
			//Execute
			component.setProps({
				state: {loading:true, sync:true}
			});
			
			//Verify
			expect(onUnmountCalled).to.eq(1);
			done();
		});
	});
	
	describe('with a subcomponent + change in the child component', function() {
		it('should render again', function(done) {
			//Prepare
			const FakeComponent = (props) => (
				<PropSwitch state={props.state}>
					<PropFetched>
						{props.value}
					</PropFetched>
				</PropSwitch>
			);
			
			const component = mount(<FakeComponent state={{loading:false, sync:true}} value={23} />);
			expect(component).to.have.html('<div data-reactroot=""><div>23</div></div>');
			
			//Execute
			component.setProps({
				state: {loading:false, sync:true},
				value: 42
			});
			
			//Verify
			expect(component).to.have.html('<div data-reactroot=""><div>42</div></div>');
			done();
		});
	});

	describe('<FetchedOnce/>', function() {
		it('is the same as <Fetched>+<NextFetch>', function(done) {
			//Prepare
			const jsxA = (state) => (
				<PropSwitch state={state}>
					<PropFetchedOnce>fetched once</PropFetchedOnce>
				</PropSwitch>
			);
			
			const jsxB = (state) => (
				<PropSwitch state={state}>
					<PropFetched>fetched once</PropFetched>
					<PropNextFetch>fetched once</PropNextFetch>
				</PropSwitch>
			);
			
			//Execute + Verify
			testAllStates(jsxA, jsxB);
			
			done();
		});
		it('should not render the content before the state is matching', function() {
			//Prepare
			let hasBeenRendered = false;
			const MyComponent = () => {
				hasBeenRendered = true;
				console.log('rendering');
				
				return (<div>OK</div>)
			};
			
			const jsx = (state) => (
				<PropSwitch state={state}>
					<PropFetchedOnce>
						<MyComponent/>
					</PropFetchedOnce>
				</PropSwitch>
			);
			
			//Execute + Verify (1)
			const componentA = shallow(jsx({loading:true, sync:false, data: {}}));
			console.log(componentA.html());
			expect(hasBeenRendered).to.eq(false);
			
			//Execute + Verify (2)
			const componentB = shallow(jsx({loading:false, sync:true, data: { ok :true }}));
			console.log(componentB.html());
			expect(hasBeenRendered).to.eq(true);
		});
	});
	
	describe('<AnyFetch/>', function() {
		it('is the same as <FirstFetch>+<NextFetch>', function(done) {
			//Prepare
			const jsxA = (state) => (
				<PropSwitch state={state}>
					<PropAnyFetch>fetching</PropAnyFetch>
				</PropSwitch>
			);
			
			const jsxB = (state) => (
				<PropSwitch state={state}>
					<PropFirstFetch>fetching</PropFirstFetch>
					<PropNextFetch>fetching</PropNextFetch>
				</PropSwitch>
			);
			
			//Execute + Verify
			testAllStates(jsxA, jsxB);
			
			done();
		});
	});
	
	describe('<FetchedOnceOrError/>', function() {
		it('is the same as <Fetched>+<NextFetch>+<Error>', function(done) {
			//Prepare
			const jsxA = (state) => (
				<PropSwitch state={state}>
					<PropFetchedOnceOrError>fetched once or error</PropFetchedOnceOrError>
				</PropSwitch>
			);
			
			const jsxB = (state) => (
				<PropSwitch state={state}>
					<PropFetched>fetched once or error</PropFetched>
					<PropNextFetch>fetched once or error</PropNextFetch>
					<PropError>fetched once or error</PropError>
				</PropSwitch>
			);
			
			//Execute + Verify
			testAllStates(jsxA, jsxB);
			
			done();
		});
	});
	
	describe('<AnyResult/>', function() {
		it('is the same as <Fetched>+<NextFetch>+<Error>', function(done) {
			//Prepare
			const jsxA = (state) => (
				<PropSwitch state={state}>
					<PropAnyResult>fetched once or error</PropAnyResult>
				</PropSwitch>
			);
			
			const jsxB = (state) => (
				<PropSwitch state={state}>
					<PropFetched>fetched once or error</PropFetched>
					<PropNextFetch>fetched once or error</PropNextFetch>
					<PropError>fetched once or error</PropError>
				</PropSwitch>
			);
			
			//Execute + Verify
			testAllStates(jsxA, jsxB);
			
			done();
		});
	});
	
	describe('<NotFetched/>', function() {
		it('is the same as <Init>+<FirstFetch>', function(done) {
			//Prepare
			const jsxA = (state) => (
				<PropSwitch state={state}>
					<PropNotFetched>not fetched...</PropNotFetched>
				</PropSwitch>
			);
			
			const jsxB = (state) => (
				<PropSwitch state={state}>
					<PropInit>not fetched...</PropInit>
					<PropFirstFetch>not fetched...</PropFirstFetch>
				</PropSwitch>
			);
			
			//Execute + Verify
			testAllStates(jsxA, jsxB);
			
			done();
		});
	});
});

function testAllStates(jsxA, jsxB) {
	const loadings = [true, false];
	const syncs = [true, false];
	const errs = [null, 'error'];
	
	const attribs = [ loadings, syncs, errs ];
	const fields = ['loading', 'sync', 'error'];
	
	function _recur(attribs, fields, acc) {
		if (attribs.length === 0) {
			const componentA = shallow(jsxA(acc));
			const componentB = shallow(jsxB(acc));
			expect(componentA).to.have.html(componentB.html());
		}
		else {
			attribs[0].forEach((v) => {
				const obj = {};
				obj[fields[0]] = v;
				const newAcc = Object.assign({}, acc, obj);
				_recur(attribs.slice(1), fields.slice(1), newAcc);
			})
		}
	}
	_recur(attribs, fields);
}

import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(chaiEnzyme());
chai.use(sinonChai);

import { Switch as PropSwitch, Init as PropInit, FirstFetch as PropFirstFetch, Fetched as PropFetched,
	NextFetch as PropNextFetch, FetchedOnce as PropFetchedOnce, AnyFetch as PropAnyFetch,
	NotFetched as PropNotFetched, Error as PropError } from '../src';

/** @namespace describe */
/** @namespace it */
/** @namespace beforeEach */
/** @namespace before */

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
	
	describe('shouldComponentUpdate()', function() {
		const shouldComponentUpdate = sinon.spy(PropSwitch.prototype, 'shouldComponentUpdate');
		
		describe('when `state` didn\'t change', function() {
			it('should return false', function(done) {
				//Prepare
				shouldComponentUpdate.reset();
				const component = shallow(<PropSwitch state={{loading:true, sync:false}}/>);
				
				//Execute
				component.setProps({
					state: {loading:true, sync:false}
				});
				
				//Verify
				expect(shouldComponentUpdate).to.have.been.callCount(1);
				expect(shouldComponentUpdate).to.have.returned(false);
				done();
			});
		});
		
		describe('when `state` didn\'t change', function() {
			it('should return false', function(done) {
				//Prepare
				shouldComponentUpdate.reset();
				const component = shallow(<PropSwitch state={{loading:true, sync:false}}/>);
				
				//Execute
				component.setProps({
					state: {loading:true, sync:true}
				});
				
				//Verify
				expect(shouldComponentUpdate).to.have.been.callCount(1);
				expect(shouldComponentUpdate).to.have.returned(true);
				done();
			});
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
			expect(component).to.have.html('<div><div style="display:block;">&quot;This is an error&quot;</div></div>');
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
			expect(component).to.have.html('<div><div style="display:block;">This is an error</div></div>');
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
			expect(componentFF).to.have.html('<div><div style="display:block;">init block</div></div>');
			done();
		});
		
		it('should render <FirstFetch> during the first fetch', function(done) {
			//Verify
			expect(componentTF).to.have.html('<div><div style="display:block;">first fetch</div></div>');
			done();
		});
		
		it('should render <PropFetched>\'s when data has been fetched', function(done) {
			//Verify
			expect(componentFT).to.have.html('<div><div style="display:block;">fetched</div><div style="display:block;">fetched 2</div></div>');
			done();
		});
		
		it('should render <NextFetch> during any non-first fetch', function(done) {
			//Verify
			expect(componentTT).to.have.html('<div><div style="display:block;">nextFetch</div></div>');
			done();
		});
		
		it('should render <Error> in case of error', function(done) {
			//Verify
			expect(componentE).to.have.html('<div><div style="display:block;">error !!!</div></div>');
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
			
			//Execute
			const componentFFA = shallow(jsxA({loading:false, sync:false}));
			const componentTFA = shallow(jsxA({loading:true, sync:false}));
			const componentFTA = shallow(jsxA({loading:false, sync:true}));
			const componentTTA = shallow(jsxA({loading:true, sync:true}));
			
			const componentFFB = shallow(jsxB({loading:false, sync:false}));
			const componentTFB = shallow(jsxB({loading:true, sync:false}));
			const componentFTB = shallow(jsxB({loading:false, sync:true}));
			const componentTTB = shallow(jsxB({loading:true, sync:true}));
			
		    //Verify
			expect(componentFFA).to.have.html(componentFFB.html());
			expect(componentFTA).to.have.html(componentFTB.html());
			expect(componentTFA).to.have.html(componentTFB.html());
			expect(componentTTA).to.have.html(componentTTB.html());
		 
			done();
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
			
			//Execute
			const componentFFA = shallow(jsxA({loading:false, sync:false}));
			const componentTFA = shallow(jsxA({loading:true, sync:false}));
			const componentFTA = shallow(jsxA({loading:false, sync:true}));
			const componentTTA = shallow(jsxA({loading:true, sync:true}));
			
			const componentFFB = shallow(jsxB({loading:false, sync:false}));
			const componentTFB = shallow(jsxB({loading:true, sync:false}));
			const componentFTB = shallow(jsxB({loading:false, sync:true}));
			const componentTTB = shallow(jsxB({loading:true, sync:true}));
			
			//Verify
			expect(componentFFA).to.have.html(componentFFB.html());
			expect(componentFTA).to.have.html(componentFTB.html());
			expect(componentTFA).to.have.html(componentTFB.html());
			expect(componentTTA).to.have.html(componentTTB.html());
			
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
			
			//Execute
			const componentFFA = shallow(jsxA({loading:false, sync:false}));
			const componentTFA = shallow(jsxA({loading:true, sync:false}));
			const componentFTA = shallow(jsxA({loading:false, sync:true}));
			const componentTTA = shallow(jsxA({loading:true, sync:true}));
			
			const componentFFB = shallow(jsxB({loading:false, sync:false}));
			const componentTFB = shallow(jsxB({loading:true, sync:false}));
			const componentFTB = shallow(jsxB({loading:false, sync:true}));
			const componentTTB = shallow(jsxB({loading:true, sync:true}));
			
			//Verify
			expect(componentFFA).to.have.html(componentFFB.html());
			expect(componentFTA).to.have.html(componentFTB.html());
			expect(componentTFA).to.have.html(componentTFB.html());
			expect(componentTTA).to.have.html(componentTTB.html());
			
			done();
		});
	});
});

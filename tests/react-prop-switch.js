import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme'
import { mount, shallow } from 'enzyme';
chai.use(chaiEnzyme());

import { Switch as PropSwitch, Init as PropInit, FirstFetch as PropFirstFetch, Fetched as PropFetched,
	NextFetch as PropNextFetch, FetchedOnce as PropFetchedOnce, AnyFetch as PropAnyFetch,
	NotFetched as PropNotFetched, Error as PropError } from '../';

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
			expect(() => shallow(<PropSwitch/>)).to.throw(Error, 'requires the prop \`state\`');
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
	
	describe('with state.error defined', function() {
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
	
	describe('with state.error not defined and no child', function() {
		it('should not render anything', function(done) {
			//Execute
			const component = shallow(<PropSwitch state={{loading:true, sync:true}}/>);
			//Verify
			expect(component).to.have.html('<div></div>');
			done();
		});
	});
	
	describe('with invalid state format', function() {
		it('should throw an error', function(done) {
			//Execute
			const fn = () => {
				shallow(
					<PropSwitch state={{}}>
						<PropInit>test</PropInit>
					</PropSwitch>
				);
			};
		    
		    //Verify
			expect(fn).to.throw(Error, 'requires the prop \`state\` to have \`loading\` and \`sync\` fields');
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
	
	describe('<Init>', function() {
		it('should render only when data has not been fetched', function(done) {
			//Prepare
			//Execute
			const component = shallow(
				<PropSwitch state={{loading:false, sync:false}}>
					<PropInit>init block</PropInit>
				</PropSwitch>
			);
			
			//Verify
			expect(component).to.have.html('<div><div style="display:block;">init block</div></div>');
			done();
		});
	});
});

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
	describe('without `prop`', function() {
		it('should throw', function(done) {
			//Execute + Verify
			expect(() => shallow(<PropSwitch/>)).to.throw(Error);
			done();
		});
	});
	
	describe('with `prop`', function() {
		it('should not throw', function(done) {
			//Execute + Verify
			shallow(<PropSwitch prop={{}}/>);
			done();
		});
	});
	
	describe('with error', function() {
		it('should render a default error when no <Error> block has been defined', function(done) {
			//Execute
			const component = shallow(<PropSwitch prop={{error: 'This is an error'}}/>);
			//Verify
			expect(component).to.have.html('<div><div style="display:block;">&quot;This is an error&quot;</div></div>');
			done();
		});
		
		it('should render a custom error when a <Error> block has been defined', function(done) {
			//Prepare
			const prop = {error: 'This is an error'};
			//Execute
			const component = shallow(
				<PropSwitch prop={prop}>
					<PropError>{prop.error}</PropError>
				</PropSwitch>
			);
			//Verify
			expect(component).to.have.html('<div><div style="display:block;">This is an error</div></div>');
			done();
		});
	});
	
	describe('without error', function() {
		it('should not render anything if there is no error', function(done) {
			//Execute
			const component = shallow(<PropSwitch prop={{}}/>);
			//Verify
			expect(component).to.have.html('<div></div>');
			done();
		});
	});
	
	describe('<Init>', function() {
		it('should render only when data has not been fetched', function(done) {
			//Prepare
			//Execute
			const component = shallow(<PropSwitch prop={{}}/>);
			//Verify
			expect(component).to.have.html('<div></div>');
			done();
		});
	});
});

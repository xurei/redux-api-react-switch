import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme'
import { mount, shallow } from 'enzyme';
chai.use(chaiEnzyme());

import { Switch as PropSwitch, Init as PropInit, FirstFetch as PropFirstFetch, Fetched as PropFetched,
	NextFetch as PropNextFetch, FetchedOnce as PropFetchedOnce, AnyFetch as PropAnyFetch,
	NotFetched as PropNotFetched } from '../';

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
			expect(() => shallow(<PropSwitch/>)).to.throw(Error);
			done();
		});
	});
	
	describe('with `prop`', function() {
		it('should not throw', function(done) {
			shallow(<PropSwitch prop={{}}/>);
			done();
		});
	});
	
	describe('without children', function() {
		it('should render a default error when there is one', function(done) {
			const component = shallow(<PropSwitch prop={{error: 'This is an error'}}/>);
			expect(component).to.have.html('<div><div>&quot;This is an error&quot;</div></div>');
			done();
		});
		
		it('should not render anything if there is no error', function(done) {
			const component = shallow(<PropSwitch prop={{}}/>);
			expect(component).to.have.html('<div></div>');
			done();
		});
	});
});

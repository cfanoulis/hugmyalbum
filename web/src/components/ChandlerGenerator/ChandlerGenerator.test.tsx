import { render } from '@redwoodjs/testing/web';

import ChandlerGenerator from './ChandlerGenerator';

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ChandlerGenerator', () => {
	it('renders successfully', () => {
		expect(() => {
			render(<ChandlerGenerator />);
		}).not.toThrow();
	});
});

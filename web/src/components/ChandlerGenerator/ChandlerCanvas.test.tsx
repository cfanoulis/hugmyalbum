import { render } from '@redwoodjs/testing/web';
import ChandlerCanvas from './ChandlerCanvas';

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ChandlerGenerator', () => {
	it('renders successfully', () => {
		expect(() => {
			render(<ChandlerCanvas show />);
		}).not.toThrow();
	});
});

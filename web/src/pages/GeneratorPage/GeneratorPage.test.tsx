import { render } from '@redwoodjs/testing/web';

import GeneratorPage from './GeneratorPage';

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('GeneratorPage', () => {
	it('renders successfully', () => {
		expect(() => {
			render(<GeneratorPage />);
		}).not.toThrow();
	});
});

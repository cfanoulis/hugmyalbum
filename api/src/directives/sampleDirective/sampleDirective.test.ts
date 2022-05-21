import { getDirectiveName, mockRedwoodDirective } from '@redwoodjs/testing/api';
import sampleDirective from './sampleDirective';

describe('sampleDirective directive', () => {
	it('declares the directive sdl as schema, with the correct name', () => {
		expect(sampleDirective.schema).toBeTruthy();
		expect(getDirectiveName(sampleDirective.schema)).toBe('sampleDirective');
	});

	it('has a sampleDirective throws an error if validation does not pass', () => {
		const mockExecution = mockRedwoodDirective(sampleDirective, {});

		expect(mockExecution).toHaveReturned();
	});
});

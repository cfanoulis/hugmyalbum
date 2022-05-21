import { createValidatorDirective, ValidatorDirectiveFunc } from '@redwoodjs/graphql-server';

export const schema = gql`
	"""
	Use @sampleDirective to validate access to a field, query or mutation.
	"""
	directive @sampleDirective on FIELD_DEFINITION
`;

const validate: ValidatorDirectiveFunc = () => {
	// this is literally required for the api server to function /shrug
	return;
};

const sampleDirective = createValidatorDirective(schema, validate);

export default sampleDirective;

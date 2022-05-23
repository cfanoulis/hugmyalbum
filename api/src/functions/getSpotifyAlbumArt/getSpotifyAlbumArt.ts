import type { APIGatewayEvent } from 'aws-lambda';
import { resolveAlbumThumbnail } from 'src/lib/spotify.js';

const spotifyURLRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/;
const spotifySymbolRegex = /spotify:(?:(album|track|playlist):|\?uri=spotify:track:)((\w|-){22})/;

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */

export const handler = async (event: APIGatewayEvent) => {
	if (event.httpMethod !== 'POST' || !event.body) return { statusCode: 400, body: 'No body provided' };

	const [_, spotifyType, itemId] = event.body.match(spotifyURLRegex) || event.body.match(spotifySymbolRegex) || [];
	if (!itemId || !['album', 'track'].includes(spotifyType)) return { statusCode: 400, body: 'Invalid URL' };

	let imageUrl;
	try {
		imageUrl = await resolveAlbumThumbnail(itemId, spotifyType as 'track' | 'album');
	} catch (error: unknown) {
		return { responseCode: 500, body: (error as Error).message };
	}
	return { responseCode: 200, body: imageUrl };
};

import type { APIGatewayEvent } from 'aws-lambda';
import { logger } from 'src/lib/logger.js';
import useRedis from 'src/lib/redis.js';
import { getAuthToken } from 'src/lib/spotify.js';
import type { Album } from 'types/Spotify';

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
	if (!itemId || spotifyType !== 'album') return { statusCode: 400, body: 'Invalid URL' };

	// Cache check
	const redis = useRedis();
	const cachedEntry = await redis.get(itemId);
	if (cachedEntry) {
		logger.info('CACHE HIT! BOOM!');
		await redis.quit();
		return {
			statusCode: 200,
			body: cachedEntry
		};
	}

	const spotifyToken = await getAuthToken().catch((e) => {
		logger.error(`Womp womp, spotify decided not to auth. Error:\n${e}`);
		throw { statusCode: 500, body: 'Spotify refused to auth' };
	});

	const albumData = await fetch(`https://api.spotify.com/v1/albums/${itemId}`, {
		headers: {
			Authorization: `Bearer ${spotifyToken}`,
			'User-Agent': 'Chalbum v1'
		}
	}).then((r) => r.json() as unknown as Album);

	const imageUrl = albumData.images.find((e) => e.height === 300 && e.width === 300).url;

	await redis.set(itemId, imageUrl);
	await redis.quit();

	return {
		statusCode: 200,

		body: imageUrl
	};
};

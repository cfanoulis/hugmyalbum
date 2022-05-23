import { logger } from 'src/lib/logger.js';
import useRedis from 'src/lib/redis.js';
import type { Album, Track } from 'types/Spotify';

export async function getAuthToken() {
	const spotifyResponse = await fetch('https://accounts.spotify.com/api/token', {
		headers: {
			Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_TOKEN}`).toString('base64'),
			'User-Agent': 'hugmyalbum.app v1',
			'content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'POST',
		body: new URLSearchParams([['grant_type', 'client_credentials']])
	});

	if (spotifyResponse.status === 200) return (await spotifyResponse.json()).access_token as string;

	throw new Error(await spotifyResponse.text());
}

export async function resolveAlbumThumbnail(id: string, idType: 'track' | 'album') {
	// Cache check
	const redis = useRedis();
	const cachedEntry = await redis.get(id);
	if (cachedEntry) {
		logger.info('CACHE HIT! BOOM!');
		await redis.quit();
		return cachedEntry;
	}

	const spotifyToken = await getAuthToken().catch((e) => {
		logger.error(`Womp womp, Spotify decided not to auth. Error:\n${e}`);
		throw 'Spotify refused to auth';
	});

	let albumData: Album;
	switch (idType) {
		case 'album':
			albumData = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
				headers: {
					Authorization: `Bearer ${spotifyToken}`,
					'User-Agent': 'hugmyalbum.app v1'
				}
			}).then((r) => {
				if (r.status !== 200) throw 'Album not found';
				return r.json() as unknown as Album;
			});
			break;
		case 'track':
			albumData = (
				await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
					headers: {
						Authorization: `Bearer ${spotifyToken}`,
						'User-Agent': 'hugmyalbum.app v1'
					}
				}).then((r) => {
					if (r.status !== 200) throw 'Track not found';
					return r.json() as unknown as Track;
				})
			).album;
			break;
	}

	const imageUrl = albumData.images.find((e) => e.height === 300 && e.width === 300)?.url;
	console.log(imageUrl);
	if (typeof imageUrl === 'undefined') throw 'No 300x300 cover art found';

	await redis.set(id, imageUrl);
	await redis.quit();

	return imageUrl;
}

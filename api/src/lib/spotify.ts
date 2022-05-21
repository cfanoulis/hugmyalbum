export async function getAuthToken() {
	const spotifyResponse = await fetch('https://accounts.spotify.com/api/token', {
		headers: {
			Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_TOKEN}`).toString('base64'),
			'User-Agent': 'Chalbum v1',
			'content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'POST',
		body: new URLSearchParams([['grant_type', 'client_credentials']])
	});

	if (spotifyResponse.status === 200) return (await spotifyResponse.json()).access_token as string;

	throw new Error(await spotifyResponse.text());
}

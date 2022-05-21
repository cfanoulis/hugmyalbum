import { MetaTags } from '@redwoodjs/web';
import { debounce } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import ChandlerCanvas from 'src/components/ChandlerGenerator/ChandlerCanvas';

const GeneratorPage = () => {
	const inputElem = useRef<HTMLInputElement>(null);

	const [error, setError] = useState<boolean | string>(false);
	const [coverArtBlob, setCoverArt] = useState<Blob>();

	const handleInputUpdate = debounce(async (event: Event) => {
		setCoverArt(undefined);
		setError(false);

		const albumUrl = (event.target as HTMLInputElement).value ?? false;
		if (!albumUrl) return;

		// get album cover art from spotify API
		const coverArtUrlReq = await fetch('api/getSpotifyAlbumArt', {
			method: 'POST',
			body: albumUrl
		});
		if (coverArtUrlReq.status !== 200) {
			setError(await coverArtUrlReq.text());
			return;
		}

		// Get img data
		const coverArtBlobReq = await fetch(await coverArtUrlReq.text());
		if (coverArtBlobReq.status !== 200) {
			setError(await coverArtUrlReq.text());
			return;
		}

		setCoverArt(await coverArtBlobReq.blob());
	}, 750);

	useEffect(() => {
		inputElem.current.addEventListener('input', handleInputUpdate);
		// we **only** want this to hook the listener on the first load
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex h-screen w-screen flex-col p-2 lg:flex-row lg:items-center lg:justify-center">
			<MetaTags
				title="Chandler, hug my album"
				description="Chandler wants some music to vide to. Give him reccomendations and see him jam to them"
				author="Charalampos Fanoulis"
			/>

			<div className="mb-8 flex flex-col lg:mr-8">
				<h1 className="mb-4 break-words text-3xl font-bold lg:text-2xl">Let Chandler hug your favourite album</h1>

				<label htmlFor="spotifyInput" className="text-xs">
					Spotify album URL
				</label>
				<input
					id="spotifyInput"
					ref={inputElem}
					placeholder="https://open.spotify.com/album/2ZYRap1o9GuuxOXwY1FHev?si=eO8x9R5RQT23u43RVNyS7A"
					type="url"
					className="mb-6 border-b-2 border-b-gray-400 bg-gray-50 p-1 lg:p-2"
				/>

				<p className="text-xs">
					<a href="https://fanoulis.dev" className="underline hover:italic active:italic">
						char
					</a>{' '}
					made this happen - and it&apos;s{' '}
					<a href="https://github.com/cfanoulis/hugmyalbum" className="underline hover:italic active:italic">
						open-source
					</a>
				</p>
			</div>
			<div>
				{error && (
					<>
						<p>Something broke: {error}</p>
					</>
				)}
				<ChandlerCanvas artBlob={coverArtBlob} show={coverArtBlob && !error} />
			</div>
		</div>
	);
};

export default GeneratorPage;

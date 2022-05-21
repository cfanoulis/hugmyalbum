import { MetaTags } from '@redwoodjs/web';
import { debounce } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import ChandlerGenerator from '../../components/ChandlerGenerator/ChandlerGenerator';

const GeneratorPage = () => {
	const inputElem = useRef<HTMLInputElement>(null);
	const [spotifyUrl, setSpotifyUrl] = useState('');

	const handleUpdate = debounce((event: Event) => {
		setSpotifyUrl((event.target as HTMLInputElement).value ?? '');
	}, 750);

	useEffect(() => {
		inputElem.current.addEventListener('input', handleUpdate);
		// we **only** want this to hook the listener on the first load
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="h-screen w-screen flex flex-col lg:flex-row lg:justify-center lg:items-center break-words p-2">
			<MetaTags title="Generator" description="Chandler loves your music taste so much" />
			<div className="lg:mr-8 mb-8 flex flex-col">
				<h1 className="font-bold text-2xl mb-4">Let Chandler hug your favourite album</h1>
				<label htmlFor="spotifyInput" className="text-xs">
					Spotify album URL
				</label>
				<input
					id="spotifyInput"
					ref={inputElem}
					placeholder="https://open.spotify.com/album/2ZYRap1o9GuuxOXwY1FHev?si=eO8x9R5RQT23u43RVNyS7A"
					type="url"
					className="align-right bg-gray-50 lg:p-2 p-1 border-b-2 border-b-gray-400 justify-self-end"
				/>
			</div>
			<ChandlerGenerator albumUrl={spotifyUrl} />
		</div>
	);
};

export default GeneratorPage;

import { Canvas, resolveImage } from 'canvas-constructor/browser';
import { useEffect, useRef, useState } from 'react';

const ChandlerGenerator = (props: { albumUrl: string }) => {
	const canvasRef = useRef();
	const albumCanvasRef = useRef();
	const [error, setError] = useState<string | false>(false);

	useEffect(() => {
		(async () => {
			const canvas = new Canvas(canvasRef.current).clearRectangle(0, 0, 1000, 1000);
			const albumCanvas = new Canvas(albumCanvasRef.current).clearRectangle(0, 0, 400, 400);
			setError(false);

			const bkg = await resolveImage('CHANDLERTEMPLATE.png');

			// this should be fetched from spotify AND CACHED AS B64
			const coverArtReq = await fetch('api/getSpotifyAlbumArt', {
				method: 'POST',
				body: props.albumUrl
			});

			if (coverArtReq.status !== 200) return setError(await coverArtReq.text());
			const albumBlob = await (await fetch(await coverArtReq.text())).blob();

			// skew album accordingly
			albumCanvas.setTransform(1, 0, -0.4, 1.1, 0, 0).printImage(await resolveImage(URL.createObjectURL(albumBlob)), 50, 50, 300, 300);

			// join them
			canvas
				.setGlobalCompositeOperation('destination-over')
				.printImage(bkg, 0, 0, 500, 500)
				.printImage(await resolveImage(await albumCanvas.toDataURL('image/png')), 80, 205, 400, 400);
		})();
	}, [props.albumUrl]);

	return (
		<>
			<h5 className={`${error && props.albumUrl !== '' ? 'visible' : 'hidden'}`}>Oh, something broke: {error}</h5>

			<canvas ref={canvasRef} height={500} width={500} className={`${error ? 'hidden' : 'visible'}`}></canvas>
			{/* https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas */}
			<canvas ref={albumCanvasRef} height={400} width={400} hidden></canvas>
		</>
	);
};

export default ChandlerGenerator;

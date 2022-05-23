import { Canvas, resolveImage } from 'canvas-constructor/browser';
import { useEffect, useRef } from 'react';

const ChandlerCanvas = (props: { artBlob?: Blob; show: boolean }) => {
	const canvasRef = useRef<HTMLCanvasElement>();
	const albumCanvasRef = useRef<HTMLCanvasElement>();

	useEffect(() => {
		(async () => {
			const canvas = new Canvas(canvasRef.current).clearRectangle(0, 0, 1000, 1000);
			const albumCanvas = new Canvas(albumCanvasRef.current).clearRectangle(0, 0, 400, 400);

			// skew album art accordingly
			albumCanvas.setTransform(1, 0, -0.4, 1.1, 0, 0).printImage(await resolveImage(URL.createObjectURL(props.artBlob)), 50, 50, 300, 300);

			// join template & art
			canvas
				.setGlobalCompositeOperation('destination-over')
				.printImage(await resolveImage('CHANDLERTEMPLATE.png'), 0, 0, 500, 500)
				.printImage(await resolveImage(await albumCanvas.toDataURL('image/png')), 80, 205, 400, 400);
		})();
	}, [props.artBlob]);

	return (
		<>
			<button
				onClick={(e) => {
					e.preventDefault();
					const link = document.createElement('a');
					link.href = canvasRef.current?.toDataURL('image/octet-stream');
					link.download = 'chandler.png';
					link.click();
				}}
				className={`${props.show ? 'visible' : 'hidden'} w-full max-w-fit`}
			>
				<canvas ref={canvasRef} height={500} width={500}></canvas>
				{/* https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas */}
				<canvas ref={albumCanvasRef} height={400} width={400} hidden></canvas>
			</button>
		</>
	);
};

export default ChandlerCanvas;

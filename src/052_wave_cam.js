import canvasSketch from 'canvas-sketch';
import { drawLine } from './lib/ctx';
import WebCam from './lib/webcam';
import { getLuminance } from './lib/color';

const settings = {
    dimensions: [600, 600],
    animate: true,
};

const sketch = async () => {
    const cam = new WebCam();
    await cam.start();

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsla(0, 0%, 98%, 1)';
        context.fillRect(0, 0, width, height);

        const camImageData = cam.getImageData();

        context.lineWidth = 1;
        const xFactor = 2;
        const lineWidth = width * xFactor;

        const linesCount = 60;
        for (let y = 1; y < linesCount; y += 1) {
            const lineDots = [];
            for (let x = 0; x < lineWidth; x += 1) {
                const iy = Math.floor((camImageData.height * y) / linesCount);
                const ix = Math.floor((camImageData.width * x) / lineWidth);

                const pixelIdx = camImageData.width * 4 * iy + 4 * ix;

                const r = camImageData.data[pixelIdx];
                const g = camImageData.data[pixelIdx + 1];
                const b = camImageData.data[pixelIdx + 2];

                const l = 1 - getLuminance(r, g, b);

                lineDots.push([
                    (x / lineWidth) * width, //
                    (y / linesCount) * height + Math.cos(x / xFactor + time * 20) * 5 * l, //
                ]);
            }
            drawLine(context, lineDots);
        }
    };
};

canvasSketch(sketch, settings);

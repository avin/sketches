import canvasSketch from 'canvas-sketch';
import { drawLine } from './lib/ctx';
import WebCam from './lib/webcam';
import { getLuminance } from './lib/color';

const settings = {
    dimensions: [720, 720],
    animate: true,
};

const sketch = async () => {
    const cam = new WebCam();
    await cam.start();

    return ({ context, width, height }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        const camImageData = cam.getImageData();

        context.font = "10px Monospace";
        context.fillStyle = '#000';

        for (let y = 1; y < height; y += 7) {
            const lineDots = [];
            for (let x = 0; x < width; x += 5) {
                const iy = Math.floor((camImageData.height * y) / height);
                const ix = Math.floor((camImageData.width * x) / width);

                const pixelIdx = camImageData.width * 4 * iy + 4 * ix;

                const r = camImageData.data[pixelIdx];
                const g = camImageData.data[pixelIdx + 1];
                const b = camImageData.data[pixelIdx + 2];

                const l = getLuminance(r, g, b);

                context.fillText(~~(l*10).toString(), x, y);
            }
            drawLine(context, lineDots);
        }
    };
};

canvasSketch(sketch, settings);

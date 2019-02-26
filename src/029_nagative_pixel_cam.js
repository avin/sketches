import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import { rope } from './lib/shape';
import WebCam from './lib/webcam';
import { getLuminance } from './lib/color';

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
    dimensions: [2048, 2048],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const size = Math.min(width, height);
    const margin = size * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const cam = new WebCam();
    await cam.start();

    return ({ context, width, height, time }) => {
        context.fillStyle = `#eff3f4`;
        context.fillRect(0, 0, width, height);

        context.lineWidth = height * 0.002;
        context.fillStyle = '#F9627D';

        let coords = [];

        let k = 0;
        for (let i = 180; i > 0; i -= 0.01) {
            k += 0.001;
            coords.push([
                ((Math.cos(i + time * 10) / 10) * k) / 2 + 0.5,
                ((Math.sin(i + time * 10) / 10) * k) / 2 + 0.5,
                Math.sqrt(k) * 2,
            ]);
        }

        const camImageData = cam.getImageData();

        const step = 0.01;
        for (let y = 0; y < 1; y += step) {
            for (let x = 0; x < 1; x += step) {
                const iy = Math.floor(camImageData.height * y);
                const ix = Math.floor(camImageData.width * x);

                const pixelIdx = camImageData.width * 4 * iy + 4 * ix;

                const r = camImageData.data[pixelIdx];
                const g = camImageData.data[pixelIdx + 1];
                const b = camImageData.data[pixelIdx + 2];

                const l = getLuminance(r, g, b);

                context.fillStyle = `rgba(0,0,0,${l})`;
                context.fillRect(sx(x), sy(y), width*step, width*step);
            }
        }
    };
};

canvasSketch(sketch, settings);

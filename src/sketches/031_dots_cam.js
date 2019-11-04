import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import palettes from 'nice-color-palettes';
import WebCam from '../lib/webcam';
import { getLuminance } from '../lib/color';

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
    dimensions: [2048, 2048],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const size = Math.min(width, height);
    const margin = size * 0.1;

    const colors = ['#547980', '#45ada8', '#9de0ad', '#e5fcc2'];

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const cam = new WebCam();
    await cam.start();

    const sideSteps = 150;

    const matrix = new Array(sideSteps)
        .fill(0)
        .map(() => new Array(sideSteps).fill(0).map(() => random.range(0.5, 0.99)));

    const pixelSize = width * (0.35 / sideSteps);

    return ({ context, width, height }) => {
        context.fillStyle = `#363030`;
        context.fillRect(0, 0, width, height);

        context.lineWidth = height * 0.001;
        context.fillStyle = '#F9627D';

        const camImageData = cam.getImageData();

        for (let y = 0; y < sideSteps; y += 1) {
            for (let x = 0; x < sideSteps; x += 1) {
                const iy = Math.floor((camImageData.height * y) / sideSteps);
                const ix = Math.floor((camImageData.width * x) / sideSteps);

                const pixelIdx = camImageData.width * 4 * iy + 4 * ix;

                const r = camImageData.data[pixelIdx];
                const g = camImageData.data[pixelIdx + 1];
                const b = camImageData.data[pixelIdx + 2];

                const l = 1 - getLuminance(r, g, b);

                if (matrix[y][x] > l) {
                    context.beginPath();
                    if (l > 0.0) {
                        context.fillStyle = colors[3];
                    }
                    if (l > 0.4) {
                        context.fillStyle = colors[2];
                    }
                    if (l > 0.6) {
                        context.fillStyle = colors[1];
                    }
                    if (l > 0.8) {
                        context.fillStyle = colors[0];
                    }

                    context.fillRect(sx(x / sideSteps), sy(y / sideSteps), pixelSize, pixelSize);
                    context.stroke();
                }
            }
        }
    };
};

canvasSketch(sketch, settings);

import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import { rope } from '../lib/shape';
import WebCam from '../lib/webcam';
import { getLuminance } from '../lib/color';

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
    dimensions: [1024, 1024],
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
        context.fillStyle = `#eff3f4AA`;
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

        coords = coords.map(([x, y, radius]) => {
            const iy = Math.floor(camImageData.height * (y / 1.6 + 0.25));
            const ix = Math.floor(camImageData.width * (x / 1.6 + 0.25));

            const pixelIdx = camImageData.width * 4 * iy + 4 * ix;

            const r = camImageData.data[pixelIdx];
            const g = camImageData.data[pixelIdx + 1];
            const b = camImageData.data[pixelIdx + 2];

            const l = getLuminance(r, g, b);

            radius *= (1 - l) * 2;

            return [sx(x), sy(y), radius * width * 0.001];
        });

        const ropeCoords = rope(coords);

        context.beginPath();
        ropeCoords.forEach((p, idx) => {
            if (idx === 0) {
                context.moveTo(p[0], p[1]);
            } else {
                context.lineTo(p[0], p[1]);
            }
        });
        context.fill();
        context.closePath();
    };
};

canvasSketch(sketch, settings);

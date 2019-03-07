import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import { drawLine } from './lib/ctx';
import WebCam from './lib/webcam';
import { getLuminance } from './lib/color';
import Stats from 'stats.js';
import Collection from './lib/collection';

const settings = {
    dimensions: [600, 600],
    animate: true,
};

const stats = new Stats();
document.body.appendChild(stats.dom);

const sketch = async ({ width, height }) => {
    const cam = new WebCam();
    await cam.start();

    const dots = new Collection();

    for (let i = 0; i < 5000; i += 1) {
        dots.add({
            x: random.range(0, width),
            y: random.range(0, height),
        });
    }

    let lastTime = 0;
    return ({ context, width, height, time }) => {
        stats.begin();

        if (time - lastTime > 0.04) {
            lastTime = time;

            for (let x = 0; x < width; x += random.range(1, 8)) {
                dots.add({
                    x,
                    y: random.range(0, 50),
                });
            }
        }

        context.fillStyle = 'hsla(0, 0%, 98%, .1)';
        context.fillRect(0, 0, width, height);

        const camImageData = cam.getImageData();

        context.fillStyle = '#000';

        for (const dot of dots) {
            const iy = Math.floor(camImageData.height * dot.y / height);
            const ix = Math.floor(camImageData.width * dot.x / width);

            const pixelIdx = camImageData.width * 4 * iy + 4 * ix;

            const r = camImageData.data[pixelIdx];
            const g = camImageData.data[pixelIdx + 1];
            const b = camImageData.data[pixelIdx + 2];

            const l = lerp(0.1, 1, getLuminance(r, g, b));

            dot.y += l * 8;

            if (dot.y >= height) {
                dots.remove(dot);
            }
        }

        const imgData = context.getImageData(0, 0, width, height);
        const data = imgData.data;

        for (const dot of dots) {
            const n = (~~dot.x + ~~dot.y * width) * 4;
            data[n] = 0;
            data[n + 1] = 0;
            data[n + 2] = 0;
            data[n + 3] = 255;
        }

        context.putImageData(imgData, 0, 0);

        stats.end();
    };
};

canvasSketch(sketch, settings);

import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import Stats from 'stats.js';
import { drawLine, setPixel } from './lib/ctx';
import WebCam from './lib/webcam';
import { getLuminance, hslToRgb } from './lib/color';
import Collection from './lib/collection';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const stats = new Stats();
document.body.appendChild(stats.dom);

const sketch = async ({ width, height, context }) => {
    const cam = new WebCam();
    await cam.start();

    const size = width;
    const dots = new Collection();

    for (let i = 0; i < size / 2; i += 1) {
        for (let j = 0; j < ~~Math.sqrt(i) * 3; j++) {
            const f = random.range(0, Math.PI * 2);
            dots.add({
                i,
                f,
                //c: hslToRgb(0, 0, random.range(0.5,1)),
                kx: random.range(-size / 20, size / 20),
                ky: random.range(-size / 20, size / 20),
                speed: 1 / Math.sqrt(i) / 5,
                x: i * Math.cos(f) + size / 2,
                y: i * Math.sin(f) + size / 2,
            });
        }
    }

    context.fillStyle = 'hsl(0, 0%, 0%)';
    context.fillRect(0, 0, width, height);

    return ({ context, width, height, time }) => {
        stats.begin();

        const camImageData = cam.getImageData();

        context.fillStyle = 'hsla(0, 0%, 0%, 0.2)';
        context.fillRect(0, 0, width, height);

        const imgData = context.getImageData(0, 0, width, height);

        for (const dot of dots) {
            dot.x = dot.i * Math.cos(dot.f) + size / 2 + dot.kx;
            dot.y = dot.i * Math.sin(dot.f) + size / 2 + dot.ky;

            const iy = Math.floor(camImageData.height * dot.y / height);
            const ix = Math.floor(camImageData.width * dot.x / width);

            const pixelIdx = camImageData.width * 4 * iy + 4 * ix;

            const r = camImageData.data[pixelIdx];
            const g = camImageData.data[pixelIdx + 1];
            const b = camImageData.data[pixelIdx + 2];

            const lumin = getLuminance(r, g, b);

            let cl = lerp(0.1, 1, lumin);
            let sl = lerp(0.5, 1, lumin);

            dot.f += dot.speed * sl;

            if (dot.x > 0 && dot.x < width && dot.y > 0 && dot.y < height) {
                [[0, -1], [-1, 0], [1, 0], [0, 1]].forEach(o => {
                    setPixel(imgData, [dot.x + o[0], dot.y + o[1]], [cl * 255, cl * 255, cl * 255, 255]);
                });
            }
        }

        context.putImageData(imgData, 0, 0);

        stats.end();
    };
};

canvasSketch(sketch, settings);

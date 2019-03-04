import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import Collection from './lib/collection';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const margin = 0;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const stars = new Collection();

    const points = [];
    const max = 500;
    for (let i = 0; i < max; i += 1) {
        points.push({
            f: random.range(0, Math.PI),
            s: random.range(-0.008, 0.008),
            r: random.range(1, 3),
            a: random.range(0.3, 0.95),
        });
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsla(0, 0%, 0%, 0.1)';
        context.fillRect(0, 0, width, height);

        for (const [idx, { f, s, r, a }] of points.entries()) {
            context.fillStyle = `hsla(0, 0%, 98%, ${a})`;

            const c = 0.25;
            const d = Math.tan(-time / 10 + f);

            let p = Math.sqrt(Math.abs(d));
            if (d < 0) {
                p *= -1;
            }

            const x = c * Math.sqrt(2) * ((p + p ** 3) / (1 + p ** 4)) + 0.5;
            const y = c * Math.sqrt(2) * ((p - p ** 3) / (1 + p ** 4)) + 0.5 + s;

            context.fillRect(sx(x), sy(y), r, r);
        }
    };
};

canvasSketch(sketch, settings);

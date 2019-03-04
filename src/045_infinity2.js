import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import Collection from './lib/collection';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const margin = width * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const stars = new Collection();

    const points = [];
    const max = 500;
    for (let i = 0; i < max; i += 1) {
        points.push({
            f: random.range(-Math.PI, Math.PI),
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

            const t = time / 3 + f;

            const scale = 2 / (3 - Math.cos(2 * t));
            const x = scale * Math.cos(t);
            const y = (scale * Math.sin(2 * t)) / 2;

            context.fillRect(sx(x / 2 + 0.5), sy(y / 2 + 0.5 + s), r, r);
        }
    };
};

canvasSketch(sketch, settings);

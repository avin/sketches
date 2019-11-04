import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import { rope } from '../lib/shape';

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
    dimensions: [2048, 2048],
    // dimensions: 'A4',
    animate: true,
};

const sketch = ({ width, height }) => {
    const size = Math.min(width, height);
    const margin = size * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

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

        coords = coords.map(([x, y, r]) => [sx(x), sy(y), r * width * 0.001]);

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

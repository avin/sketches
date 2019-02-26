import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import { rope } from './lib/shape';

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
    //dimensions: [2048, 2048],
    dimensions: 'A4',
    animate: false,
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
        context.strokeStyle = '#5B3758';

        for (let iy = 0; iy < 1; iy += 0.05) {
            const coords = [];
            for (let i = 0; i < 1; i += 0.01) {
                coords.push([sx(i), sy(iy), random.range(height * 0.003, height * 0.009)]);
            }

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
            context.stroke();
        }
    };
};

canvasSketch(sketch, settings);

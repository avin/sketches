import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import { getPhase } from './lib/time';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height, context }) => {
    const margin = width * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    context.fillStyle = 'hsl(0, 0%, 0%)';
    context.fillRect(0, 0, width, height);

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsla(0, 0%, 0%, 0.02)';
        context.fillRect(0, 0, width, height);

        const totalPhases = 4;
        const [, phaseState] = getPhase(time, 5, totalPhases);

        context.fillStyle = 'hsla(0, 0%, 98%, 0.8)';

        for (let i = 0; i < 0.48; i += 0.01) {
            [[i, i], [1 - i, i], [1 - i, 1 - i], [i, 1 - i]].forEach((p, idx) => {
                const direction = directions[idx];
                const x = p[0] + direction[0] * phaseState * (1 - i * 2) + random.range(-0.001, 0.001);
                const y = p[1] + direction[1] * phaseState * (1 - i * 2) + random.range(-0.001, 0.001);
                context.fillRect(sx(x), sy(y), 2, 2);
            });
        }
    };
};

canvasSketch(sketch, settings);

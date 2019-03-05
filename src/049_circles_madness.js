import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import { drawLine } from './lib/ctx';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const margin = width * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const circles = [];
    const total = 200;
    for (let i = total / 20; i < total; i += 0.5) {
        const circleCoords = [];
        for (let j = -Math.PI; j < Math.PI; j += random.range(0.01, 0.1)) {
            const rF = i / total + random.noise1D(Math.abs(j) + i, i / total) / 20;
            circleCoords.push([
                (rF * Math.cos(j)) / 2 + 0.5, // x
                (rF * Math.sin(j)) / 2 + 0.5, // y
            ]);
        }
        circles.push(circleCoords);
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsla(0, 0%, 0%)';
        context.fillRect(0, 0, width, height);

        context.strokeStyle = `hsla(0,0%,98%,0.5)`;
        context.lineWidth = 1;

        for (const circle of circles) {
            const circleCoords = circle.map(i => [sx(i[0]), sy(i[1])]);
            drawLine(context, circleCoords, true);
        }
    };
};

canvasSketch(sketch, settings);

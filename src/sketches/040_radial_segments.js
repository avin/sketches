import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const margin = width * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);
    const sr = v => lerp(margin / 2, (height - margin) / 2, v);

    const segments = [];

    let odd = true;
    for (let i = 0; i < 1; i += 0.02) {
        odd = !odd;
        const segment = {
            r: i,
            aFrom: random.range(-Math.PI, Math.PI),
            direction: odd ? random.range(-2, -0.5) : random.range(0.5, 2),
            c: `hsl(0,0%,${random.range(10, 40)}%)`,
        };
        segment.aTo = segment.aFrom + random.range(Math.PI * 0.5, Math.PI * 1.5);
        segments.push(segment);
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        segments.forEach(s => {
            context.beginPath();
            context.strokeStyle = s.c;
            context.lineWidth = width / 2 / segments.length / 2;
            context.arc(sx(0.5), sy(0.5), sr(s.r), s.aFrom + time * s.direction, s.aTo + time * s.direction, false);
            context.stroke();
        });
    };
};

canvasSketch(sketch, settings);

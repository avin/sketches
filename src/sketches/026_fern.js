// Made using tut https://medium.com/@kasimoka/папоротник-барнсли-на-javascript-59d427de6521

import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import { lineLength } from '../lib/geometry';

const settings = {
    dimensions: [600, 600],
    animate: true,
};

const sketch = ({ width, height, context }) => {
    const size = Math.min(width, height);
    const margin = size * 0.1;

    const maxSegments = 6;

    const startColorFactor = random.range(0, 360);

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    function config(alpha, beta, k, k1) {
        return {
            A: Math.cos(alpha),
            B: Math.sin(alpha),
            C: 1 - k,
            D: k,
            E: 1 - k1,
            F: k1,
            G: Math.cos(beta),
            H: Math.sin(beta),
        };
    }

    function draw(s, x1, y1, x2, y2, num, time) {
        if (num < maxSegments && lineLength([x1, y1], [x2, y2]) > size * 0.0125) {
            const x3 = (x2 - x1) * s.A - (y2 - y1) * s.B + x1;
            const y3 = (x2 - x1) * s.B + (y2 - y1) * s.A + y1;
            const x4 = x1 * s.C + x3 * s.D;
            const y4 = y1 * s.C + y3 * s.D;
            const x5 = x4 * s.E + x3 * s.F;
            const y5 = y4 * s.E + y3 * s.F;
            const x6 = (x5 - x4) * s.G - (y5 - y4) * s.H + x4;
            const y6 = (x5 - x4) * s.H + (y5 - y4) * s.G + y4;
            const x7 = (x5 - x4) * s.G + (y5 - y4) * s.H + x4;
            const y7 = -(x5 - x4) * s.H + (y5 - y4) * s.G + y4;

            context.beginPath();
            context.strokeStyle = `hsl(${num * 30 + startColorFactor + 60 * Math.cos(time)}, 50%, 50%)`; // 'green';
            context.moveTo(x1, y1);
            context.lineTo(x4, y4);
            context.arc(x4, y4, (6 - num) / 3, 0, Math.PI * 2, false);
            context.stroke();

            draw(s, x4, y4, x3, y3, num, time);
            draw(s, x4, y4, x6, y6, num + 1, time);
            draw(s, x4, y4, x7, y7, num + 1, time);
        }
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        context.lineWidth = size * 0.001;

        const alpha = Math.cos(time) / 20; // угол изгиба папоротника.
        const beta = Math.PI / 3; // угол роста "листочков" от ствола.
        const k = 0.12; // пышность папоротника (при увеличении редеет, при уменьшении становится пышнее).
        const k1 = 0.35; // коэффициент уменьшения длины штрихов из которых состоит папоротник.
        const s = config(alpha, beta, k, k1);

        draw(s, margin * 2, height - margin * 2, width - margin * 2, margin * 2, 2, time);
    };
};

canvasSketch(sketch, settings);

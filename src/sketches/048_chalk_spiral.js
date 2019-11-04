import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import { drawLine } from '../lib/ctx';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const margin = width * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const lines = [];
    for (let i = 0; i < 5; i += 1) {
        lines.push({
            s: random.range(0, 0.5),
            f: random.range(1, 100),
            c: `hsl(0,0%,${random.range(20, 70)}%)`,
            b: [],
        });
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsla(0, 0%, 5%,0.1)';
        context.fillRect(0, 0, width, height);

        for (const line of lines) {
            context.fillStyle = 'hsl(0, 0%, 98%)';
            context.strokeStyle = 'hsl(0, 0%, 98%)';

            const t = time + line.s;
            const x = sx(Math.cos(t * 5 + random.noise1D(t + line.f, 50) / 4) / 2 + 0.5);
            const y = sy(Math.sin(t * 6 + random.noise1D(t + line.f, 50) / 4) / 2 + 0.5);

            if (line.b.length > 2) {
                context.strokeStyle = line.c;
                drawLine(context, line.b);
            }

            line.b.push([x, y]);
            if (line.b.length > 300) {
                line.b = line.b.slice(1);
            }
        }
    };
};

canvasSketch(sketch, settings);

import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import { drawLine } from './lib/ctx';

const settings = {
    dimensions: [1024, 1024],
    animate: false,
};

const sketch = async ({ width, height }) => {
    const margin = width * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    return ({ context, width, height }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        context.lineWidth = width * 0.003;

        const lines = [];

        let odd = true;

        const step = Math.PI / 11;
        for (let i = step; i <= Math.PI * 2; i += step) {
            odd = !odd;
            const line = [];

            for (let j = 0.0; j <= 1; j += 0.001) {
                line.push([
                    Math.cos(i + Math.cos(j * Math.PI) * (odd ? 1 : -1)) / 2 * j + 0.5, // x
                    Math.sin(i + Math.cos(j * Math.PI) * (odd ? 1 : -1)) / 2 * j + 0.5, // y
                ]);
            }

            lines.push(line);
        }

        lines.forEach(line => {
            line = line.map(p => [sx(p[0]), sy(p[1])]);
            drawLine(context, line);
        });

        context.beginPath();
        context.arc(sx(0.5), sy(0.5), width / 2 - margin, 0, Math.PI * 2);
        context.stroke();
    };
};

canvasSketch(sketch, settings);

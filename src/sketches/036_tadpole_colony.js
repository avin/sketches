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

    const points = new Array(500).fill(0).map(() => {
        return {
            x: 0.25,
            y: 0.25,
            b: [],
            color: `hsl(0, 0%, ${random.range(0, 80)}%)`,
        };
    });

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        points.forEach(p => {
            p.x += random.range(-0.01, 0.01) + 0.01 * Math.cos(time);
            p.y += random.range(-0.01, 0.01) + 0.01 * Math.sin(time);

            p.x = Math.min(1, Math.max(0, p.x));
            p.y = Math.min(1, Math.max(0, p.y));

            context.beginPath();
            if (p.b.length) {
                context.strokeStyle = p.color;
                p.b.forEach((pB, idx) => {
                    if (idx === 0) {
                        context.moveTo(sx(pB[0]), sy(pB[1]));
                    } else {
                        context.lineTo(sx(pB[0]), sy(pB[1]));
                    }
                });

                context.lineTo(sx(p.x), sy(p.y));
            }
            context.stroke();

            context.beginPath();
            context.fillStyle = p.color;
            context.arc(sx(p.x), sy(p.y), 3, 0, Math.PI * 2, false);
            context.fill();

            p.b.push([p.x, p.y]);
            if (p.b.length > 100) {
                p.b = p.b.slice(1);
            }
        });
    };
};

canvasSketch(sketch, settings);

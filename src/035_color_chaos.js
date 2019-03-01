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
        return { x: 0.5, y: 0.5, bX: null, bY: null, color: `hsl(${random.range(0, 360)}, 80%, 50%)` };
    });

    return ({ context }) => {
        points.forEach(p => {
            p.x += random.range(-0.01, 0.01);
            p.y += random.range(-0.01, 0.01);

            p.x = Math.min(1, Math.max(0, p.x));
            p.y = Math.min(1, Math.max(0, p.y));

            context.beginPath();
            if (p.bX !== null) {
                context.strokeStyle = p.color;
                context.moveTo(sx(p.bX), sy(p.bY));
                context.lineTo(sx(p.x), sy(p.y));
            }
            context.stroke();

            p.bX = p.x;
            p.bY = p.y;
        });
    };
};

canvasSketch(sketch, settings);

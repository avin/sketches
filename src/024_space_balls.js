import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import { pointsDistance } from './lib/geometry';

const settings = {
    dimensions: [2048, 2048],
    animate: true,
};

const sketch = ({ width, height }) => {
    const margin = 0;
    const size = Math.min(width, height);

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const points = [];
    for (let i = 0; i < 1000; i += 1) {
        const point = {
            x: random.gaussian() / 10 + 0.5,
            y: random.gaussian() / 10 + 0.5,
        };

        points.push(point);
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        context.lineWidth = size * 0.001;

        points.forEach((p, idx) => {
            p.x += Math.cos(random.noise1D(idx * 1000, 0.5) * Math.PI + time / 2) * 0.001;
            p.y += Math.sin(random.noise1D(idx * 10000, 0.5) * Math.PI + time / 2) * 0.001;
        });

        points.forEach(point => {
            let count = 0;
            let radius = 1;
            points.forEach(aPoint => {
                if (point === aPoint) {
                    return;
                }
                const distance = pointsDistance(point.x, point.y, aPoint.x, aPoint.y);

                radius = Math.min(distance / 2, radius);
            });

            context.beginPath();
            context.fillStyle = `hsl(0, 0%, ${Math.max(50, 98 - radius * 100 * 10)}%)`;
            context.arc(sx(point.x), sy(point.y), sx(radius), 0, Math.PI * 2, false);
            context.fill();
            //context.stroke();
        });
    };
};

canvasSketch(sketch, settings);

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
    const maxNearCount = 8;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const points = [];
    for (let i = 0; i < 500; i += 1) {
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
            points.forEach(aPoint => {
                if (point === aPoint) {
                    return;
                }
                const distance = pointsDistance(point.x, point.y, aPoint.x, aPoint.y);

                const distFactor = sx(distance) / (size * 0.03);
                if (distFactor < 1) {
                    count += 1;
                    if (count > maxNearCount) {
                        return;
                    }
                    const alpha = 1 - distFactor;
                    context.beginPath();
                    context.strokeStyle = `hsla(${distFactor * 240 + 120 + time * 10},80%,50%, ${alpha})`;

                    context.moveTo(sx(point.x), sy(point.y));
                    context.lineTo(sx(aPoint.x), sy(aPoint.y));
                    context.stroke();
                }
            });
        });

        context.lineWidth = size * 0.001;
        context.fillStyle = 'hsl(0, 0%, 12%)';

        points.forEach(point => {
            context.beginPath();
            context.arc(sx(point.x), sy(point.y), size * 0.001, 0, Math.PI * 2, false);
            context.fill();
        });
    };
};

canvasSketch(sketch, settings);

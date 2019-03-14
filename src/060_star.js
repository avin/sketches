import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import * as dat from 'dat.gui';
import { drawLine } from './lib/ctx';
import { pointsDistance } from './lib/geometry';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

function perc(min, max, value) {
    const total = max - min;
    const current = max - value;

    return current / total;
}

const sketch = async ({ width, height, context }) => {
    const params = {
        corners: 32,
        distanceColor: true,
        inverseColor: false,
        minDistance: 0.68,
        maxDistance: 0.9,
    };

    const gui = new dat.GUI();
    gui.add(params, 'corners', 4, 64, 4);
    gui.add(params, 'distanceColor');
    gui.add(params, 'inverseColor');
    gui.add(params, 'minDistance', 0, 1);
    gui.add(params, 'maxDistance', 0, 1);

    const margin = width * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    let points = [];

    const drawLineToNeighbors = point => {
        const { minDistance, maxDistance } = params;
        const neighbors = [];
        points.forEach(p => {
            const distance = pointsDistance(p.x, p.y, point.x, point.y);
            if (distance <= maxDistance && distance >= minDistance) {
                neighbors.push({
                    aPoint: p,
                    distance,
                });
            }
        });

        for (const { aPoint, distance } of neighbors) {
            const line = [[aPoint.x, aPoint.y], [point.x, point.y]].map(p => [sx(p[0]), sx(p[1])]);

            if (params.distanceColor) {
                let distancePerc = perc(minDistance, maxDistance, distance);
                if (params.inverseColor) {
                    distancePerc = 1 - distancePerc;
                }
                context.strokeStyle = `hsl(0,0%,${distancePerc * 80}%)`;
            }

            drawLine(context, line);
        }
    };

    return ({ context }) => {
        context.fillStyle = 'hsla(0, 0%, 98%, 1)';
        context.fillRect(0, 0, width, height);

        points = [];
        const step = Math.PI / (params.corners / 2);

        for (let i = -Math.PI; i < Math.PI; i += step) {
            points.push({
                x: Math.cos(i) * 0.5 + 0.5,
                y: Math.sin(i) * 0.5 + 0.5,
            });
        }

        context.fillStyle = 'hsl(0, 0%, 10%)';

        for (const point of points) {
            context.fillRect(sx(point.x), sy(point.y), 1, 1);

            drawLineToNeighbors(point);
        }
    };
};

canvasSketch(sketch, settings);

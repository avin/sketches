import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import { Delaunay } from 'd3-delaunay';

const settings = {
    dimensions: [2048, 2048],
    animate: false,
};

const sketch = ({ width, height }) => {
    const margin = 0;
    const size = Math.min(width, height);

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const points = [];
    for (let i = 0; i < 30; i += 1) {
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

        const pointsCoords = points.map(p => [p.x, p.y]);

        const delaunay = Delaunay.from(pointsCoords);
        const voronoi = delaunay.voronoi([0, 0, 1, 1]);

        for (const polygon of voronoi.cellPolygons()) {
            context.beginPath();
            polygon.forEach(([x, y], idx) => {
                if (idx === 0) {
                    context.moveTo(sx(x), sy(y));
                } else {
                    context.lineTo(sx(x), sy(y));
                }
            });
            context.stroke();
        }
    };
};

canvasSketch(sketch, settings);

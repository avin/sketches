import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import * as dat from 'dat.gui';
import { drawLine } from '../lib/ctx';
import { pointsDistance } from '../lib/geometry';
import { extendGui } from '../lib/gui';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height }) => {
    let points = [];

    const params = {
        maxPoints: 5000,
        initRadius: 0.25,
        initPoints: 16,
        lineWidth: 0.5,
        kinkSize: 0.01,
        deviation: 0.1,
    };

    const restPoints = () => {
        points = [];

        const step = Math.PI / params.initPoints;
        for (let i = -Math.PI; i < Math.PI; i += step) {
            points.push({
                x: Math.cos(i) * params.initRadius + 0.5,
                y: Math.sin(i) * params.initRadius + 0.5,
            });
        }
    };

    const gui = new dat.GUI();
    extendGui(gui);

    gui.add(params, 'maxPoints', 500, 20000);
    gui.add(params, 'initRadius', 0.05, 0.5);
    gui.add(params, 'initPoints', 4, 64, 4);
    gui.add(params, 'lineWidth', 0.1, 2);
    gui.add(params, 'kinkSize', 0.0005, 0.1);
    gui.add(params, 'deviation', 0.01, 0.5);

    gui.onChange(() => {
        restPoints();
    });

    const margin = width * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    restPoints();

    let beforeTime = -1;
    return ({ context, time }) => {
        if (time - beforeTime >= 0.1) {
            beforeTime = time;
        } else {
            return;
        }
        context.fillStyle = 'hsla(0, 0%, 98%, 1)';
        context.fillRect(0, 0, width, height);

        context.fillStyle = 'hsl(0, 0%, 10%)';
        context.lineWidth = params.lineWidth;

        const newPoints = [];

        for (let i = 0; i < points.length; i += 1) {
            const p1 = points[i];
            const p2 = points[i + 1 === points.length ? 0 : i + 1];
            const distance = pointsDistance(p1.x, p1.y, p2.x, p2.y);

            newPoints.push(p1);

            if (distance > params.kinkSize) {
                newPoints.push({
                    x: (p1.x + p2.x) / 2,
                    y: (p1.y + p2.y) / 2,
                });
            }
        }

        if (newPoints.length < params.maxPoints) {
            points = newPoints;
        }

        for (let i = 0; i < points.length; i += 1) {
            const pB = points[i - 1 === -1 ? points.length - 1 : i - 1];
            const p = points[i];
            const pA = points[i + 1 === points.length ? 0 : i + 1];

            const angle1 = Math.atan2(p.y - pB.y, p.x - pB.x);
            const angle2 = Math.atan2(p.y - pA.y, p.x - pA.x);

            const angle = angle1 - angle2;

            if (Math.abs(~~(angle * 10000)) === ~~(Math.PI * 10000)) {
                p.x += Math.cos(angle1 + Math.PI / 2) * params.deviation;
                p.y += Math.sin(angle1 + Math.PI / 2) * params.deviation;
            }
        }

        const lineCoords = [];
        for (const p of points) {
            lineCoords.push([sx(p.x), sy(p.y)]);
        }
        drawLine(context, lineCoords, true);
    };
};

canvasSketch(sketch, settings);

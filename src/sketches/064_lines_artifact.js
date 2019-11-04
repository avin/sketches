import canvasSketch from 'canvas-sketch';
import { vec2 } from 'gl-matrix';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async () => {
    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        const step = Math.PI * 0.005;
        for (let angle = -Math.PI + step; angle < Math.PI; angle += step) {
            const normal = [Math.cos(angle), Math.sin(angle)];
            const normal2 = [Math.cos(angle + time / 5), Math.sin(angle + time / 5)];
            const length = width / 2.2;
            const thickness = 0.5;

            const center = [width / 2, height / 2];

            const line = [-1, 1].map(dir => vec2.scaleAndAdd([], center, normal, dir * length));
            const line2 = [-1, 1].map(dir => vec2.scaleAndAdd([], center, normal2, dir * length));

            // Draw line segment
            context.beginPath();
            line.forEach(([x, y]) => context.lineTo(x, y));
            line2.forEach(([x, y]) => context.lineTo(x, y));
            context.lineWidth = thickness;
            context.stroke();
        }
    };
};

canvasSketch(sketch, settings);

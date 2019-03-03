import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const drawLine = (context, lineCoords) => {
    context.beginPath();
    for (let i = 0; i < lineCoords.length; i += 1) {
        const p = lineCoords[i];
        if (i === 0) {
            context.moveTo(p[0], p[1]);
        } else {
            context.lineTo(p[0], p[1]);
        }
    }
    context.stroke();
};

const sketch = async ({ width, height }) => {
    const margin = width * 0.01;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        const lines = [];

        for (let i = -Math.PI; i < Math.PI; i += Math.PI / 32) {
            const line = [];

            line.push([0.5, 0.5]);
            for (let j = 0.01; j < 0.5; j += 0.1) {
                line.push([
                    Math.cos(i + Math.cos(time + i) + j*20) * j + 0.5,
                    Math.sin(i + Math.cos(time + i) + j*20) * j + 0.5,
                ]);
            }

            lines.push(line);
        }

        lines.forEach(line => {
            line = line.map(p => [sx(p[0]), sy(p[1])]);
            drawLine(context, line);
        });
    };
};

canvasSketch(sketch, settings);

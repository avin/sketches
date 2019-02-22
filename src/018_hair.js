const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = ({ width, height }) => {
    const margin = width * 0.1;

    const x = v => lerp(margin, width - margin, v);
    const y = v => lerp(margin, height - margin, v);

    const step = 0.01;
    const matrix = [];
    for (let y = 0; y < 1; y += step) {
        const row = [];
        for (let x = 0; x < 1; x += step) {
            row.push([x + random.range(-step, step), y + random.range(-step, step)]);
        }
        matrix.push(row);
    }

    return ({ context, width, height, time }) => {
        time = time || 0;
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        context.fillStyle = '#F00';
        context.lineWidth = width * 0.0001;

        matrix.forEach(row => {
            row.forEach(p => {
                const rI = random.noise2D(p[0] + time / 5, p[1], 1.5) / 2 + 0.5;
                context.save();
                context.beginPath();
                context.translate(x(p[0]), y(p[1]));
                context.rotate(rI * Math.PI * 2);
                context.strokeStyle = `hsl(0,0%,${20 + rI * 20}%)`;

                context.moveTo(0, 0);
                context.lineTo(width * 0.05 * random.range(0.8, 1), 0);

                context.stroke();
                context.restore();
            });
        });
    };
};

canvasSketch(sketch, settings);

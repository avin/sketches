const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
    dimensions: [2048, 2048],
};

const colors = random.pick(palettes);

const sketch = () => {
    return ({ context, width, height }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        const generateLine = () => {
            const linePointSteps = 100;
            const line = [];

            for (let i = 0; i <= linePointSteps; i += 1) {
                const distanceToCenter = Math.abs(linePointSteps / 2 - i) / linePointSteps;
                line.push([i / linePointSteps, -(random.value() * height * 0.001) + 1 / distanceToCenter]);
            }
            return line;
        };

        const drawLine = (line, posY) => {
            context.moveTo(0, posY);
            line.forEach(([x, y]) => {
                context.lineTo(width * x, posY + y * height * 0.01);
            });
            context.lineTo(width, height);
            context.lineTo(0, height);
            context.fillStyle = random.pick(colors);
            context.fill();
        };

        context.lineWidth = width * 0.001;

        const step = width * 0.02;

        for (let y = 200; y < height; y += step) {
            context.beginPath();
            drawLine(generateLine(), y);
            context.stroke();
        }
    };
};

canvasSketch(sketch, settings);

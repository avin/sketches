const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [2048, 2048],
    animate: true,
};

const sketch = () => {
    let bX;
    let bY;
    let firstTime = true;

    return ({ context, width, height, time }) => {
        if (firstTime) {
            context.fillStyle = 'hsl(0, 0%, 98%)';
            context.fillRect(0, 0, width, height);

            firstTime = false;
        }

        context.beginPath();

        const x = width / 2 + Math.cos(time * 10) * width * 0.1 + (Math.cos(time / 5) * width) / 3.5;
        const y = height / 2 + Math.sin(time * 12) * width * 0.1 + (Math.cos(time / 5) * width) / 3.5;
        context.lineWidth = Math.cos(time) * width * 0.002 + width * 0.006 * random.range(0.7, 1);
        if (bX !== undefined) {
            context.moveTo(bX, bY);
            context.lineTo(x, y);
        }
        bX = x;
        bY = y;
        context.strokeStyle = `hsl(${Math.cos(time * 7) * 180 + 180}, 50%, 50%)`;
        context.stroke();
    };
};

canvasSketch(sketch, settings);

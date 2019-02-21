const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [1500, 1500],
    animate: true,
    antialias: true,
};

const sketch = () => {
    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0,0%,5%)';
        context.fillRect(0, 0, width, height);

        context.translate(width / 2, height / 2);

        context.lineWidth = width * 0.02;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.moveTo(0, 0);

        let r = 0;
        const step = 0.1;
        let bx;
        let by;
        let firstTime = true;
        for (let i = 0; i < Math.PI * 2 * 40; i += step) {
            if (firstTime) {
                firstTime = false;
                bx = Math.sin(i) * r;
                by = Math.cos(i) * r;
            } else {
                const x = Math.sin(i - time * 20) * r;
                const y = Math.cos(i - time * 20) * r;
                context.beginPath();
                context.strokeStyle = `hsl(${i + 100},20%,${100 - i / 2}%)`;
                context.moveTo(bx, by);
                context.lineWidth -= 1 / ((width * step) / 5);
                r += (width * step) / (width * 0.1);
                context.lineTo(x, y);
                context.stroke();

                bx = x;
                by = y;
            }
        }
    };
};

canvasSketch(sketch, settings);

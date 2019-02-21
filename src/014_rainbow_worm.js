const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = () => {
    function setTransformToLine(x1, y1, x2, y2, ctx) {
        const vx = x2 - x1; // get the line as vector
        const vy = y2 - y1;
        const len = Math.hypot(vx, vy); // For <= IE11 use Math.sqrt(vx * vx + vy * vy)
        const nx = vx / len; // Normalise the line vector. Making it one
        const ny = vy / len; // pixel long. This sets the scale

        ctx.setTransform(nx, ny, -ny, nx, x1, y1); // set transform

        return len;
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0,0%,98%)';
        context.fillRect(0, 0, width, height);
        context.lineWidth = 0;

        const margin = width * 0.1;

        let firstDot = true;
        let thickness = 0;
        let xBefore;
        let yBefore;
        let thicknessBefore;
        for (let u = 0; u <= 1; u += 0.005) {
            thickness = ((Math.cos(u * 30 + Math.cos(time / 1.5) * 10) / 2 + 0.8) * width) / 20;

            const x = lerp(margin, width - margin, u);
            const y = height / 2 + Math.cos((u + time / 3) * 5) * 200;

            if (firstDot) {
                firstDot = false;
            } else {
                setTransformToLine(xBefore, yBefore, x, y, context);
                context.beginPath();

                context.lineTo(xBefore - x, -thicknessBefore);
                context.lineTo(((x / xBefore) * (x - xBefore)) / 1.5, -thickness);
                context.lineTo(((x / xBefore) * (x - xBefore)) / 1.5, +thickness);
                context.lineTo(xBefore - x, +thicknessBefore);
                context.fillStyle = `hsl(${360 * 1.5 * Math.cos(time + u)}, 50%, 50%)`;
                context.moveTo(x, y + thickness);
                context.fill();
                // context.stroke();

                context.setTransform(1, 0, 0, 1, 0, 0);
            }

            thicknessBefore = thickness;
            xBefore = x;
            yBefore = y;
        }
    };
};

canvasSketch(sketch, settings);

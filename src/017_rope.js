const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = ({ width, height }) => {
    const margin = width * 0.1;

    const x = v => lerp(margin, width - margin, v);
    const y = v => lerp(height / 2 - margin, height / 2 + margin, v) - height * 0.3;

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsla(0, 0%, 98%, 0.25)';
        context.fillRect(0, 0, width, height);

        context.lineWidth = width * 0.001;

        const line = [];
        for (let i = 0; i < 1; i += 0.01) {
            line.push([x(i), y(Math.cos(i * 10 + time) / 2 + 0.5)]);
        }
        const lineContour1 = [];
        const lineContour2 = [];

        // Bones lines
        context.beginPath();
        line.forEach((p, idx) => {
            if (idx === 0) {
                context.moveTo(p[0], p[1]);
            } else {
                context.lineTo(p[0], p[1]);

                const pB = line[idx - 1];

                const A = Math.atan2(pB[1] - p[1], pB[0] - p[0]); // radians
                const R = width * 0.04 + Math.cos(time + idx / 2) * width * 0.02;

                [-(Math.PI / 2), -(Math.PI / 2) * 3].forEach((rotate, idx) => {
                    const xC = R * Math.cos(A + rotate);
                    const yC = R * Math.sin(A + rotate);

                    context.lineTo(xC + p[0], yC + p[1]);

                    if (idx % 2) {
                        lineContour1.push([xC + p[0], yC + p[1]]);
                    } else {
                        lineContour2.push([xC + p[0], yC + p[1]]);
                    }

                    context.moveTo(p[0], p[1]);
                });
            }
        });
        context.stroke();

        // Circles contour
        const lineContour = [...lineContour1, ...lineContour2.reverse()];
        lineContour.forEach(p => {
            context.beginPath();
            context.arc(p[0], p[1] + height * 0.3, width * 0.002, 0, Math.PI * 2, false);
            context.stroke();
        });

        // Filled line
        context.beginPath();
        lineContour.forEach((p, idx) => {
            if (idx === 0) {
                context.moveTo(p[0], p[1] + height * 0.6);
            } else {
                context.lineTo(p[0], p[1] + height * 0.6);
            }
        });
        context.closePath();
        context.fillStyle = `hsl(0, 0%, 88%)`;
        context.fill();
        context.stroke();
    };
};

canvasSketch(sketch, settings);

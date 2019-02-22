const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');

const settings = {
    dimensions: [2048, 2048],
    animate: false,
};

const breakLine = (line, min = 0.05, max = 0.15, sep = 0.02) => {
    let results = [];

    let x = line[0];

    while (x < line[1]) {
        const lx = x + random.range(min, max);
        results.push([x, Math.min(lx, line[1])]);

        x = lx + sep;
    }

    if (results.length) {
        let lastOne = results[results.length - 1];
        if (lastOne[1] - lastOne[0] < min) {
            results.splice(-1, 1);
        }
        results[results.length - 1][1] = line[1];
    }

    return results;
};

const sketch = ({ width, height }) => {
    const margin = width * 0.1;
    const lineWidth = height * 0.008;
    console.log(lineWidth);

    // const step = 0.025;

    let values = [];
    for (let y = -1; y < 1; y += lineWidth / height * 5) {
        const ri = [];
        for (let x = -1; x < 1; x +=  0.0001) {
            const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

            if (distance < 1) {
                if (ri.length === 0) {
                    ri[0] = x / 2 + 0.5;
                } else {
                    ri[1] = x / 2 + 0.5;
                }
            }
        }
        values.push(ri);
    }

    values = values.map(v => {
        return breakLine(v);
    });

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        const sx = v => lerp(margin - width / 2, width - margin - width / 2, v);
        const sy = v => lerp(margin - height / 2, height - margin - height / 2, v);

        context.lineWidth = lineWidth;
        context.lineCap = 'round';

        context.translate(width / 2, height / 2);
        context.rotate(Math.PI / 12);

        values.forEach((row, idx) => {
            row.forEach(v => {
                context.beginPath();
                if (random.value() > 0.8) {
                    context.strokeStyle = 'hsl(0, 0%, 70%)';
                } else {
                    context.strokeStyle = 'hsl(0, 0%, 20%)';
                }
                context.moveTo(sx(v[0]), sy(idx / values.length));
                context.lineTo(sx(v[1]), sy(idx / values.length));
                context.stroke();
            });
        });
    };
};

canvasSketch(sketch, settings);

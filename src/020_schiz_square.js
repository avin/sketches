const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = ({ width, height }) => {
    const margin = width * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const points = [];

    const steps = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
    let size = 1;

    let n = 0;

    const processStep = (step, i) => {
        n += 1;
        size -= random.range(0.003, 0.006);

        i += 1;
        points.push({
            x: (step[0] * size + random.range(-1, 1) * i * 0.0002) / 2 + 0.5,
            y: (step[1] * size + random.range(-1, 1) * i * 0.0002) / 2 + 0.5,
            colorS1: n * 2 + random.range(-10, 10),
            colorS2: 100 - n / 4,
            colorS3: 50 - n / 5,
            seed1: random.range(-Math.PI, Math.PI),
            seed2: random.range(-Math.PI, Math.PI),

            seedPack: new Array(10).fill(null).map(() => random.range(-Math.PI, Math.PI)),
        });
    };
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i += 1) {
        if (size < 0) {
            break;
        }
        steps.forEach(step => processStep(step, i));
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        const s = points.length;
        points.forEach((point, idx) => {
            if (idx !== 0) {
                context.lineWidth = width * 0.004 / 10;

                const bPoint = points[idx - 1];
                const mFactor = 5 + width * 0.05 * idx / s;
                const chatterFactor = 2 + idx / s * (width * 0.005);

                for (let i = 0; i < point.seedPack.length - 1; i += 1) {
                    context.beginPath();
                    context.strokeStyle = `hsl(${-time * 10 + point.colorS1},${point.colorS2}%,${point.colorS3}%)`;

                    context.moveTo(
                        sx(bPoint.x) +
                            Math.sin(time + bPoint.seed1) * mFactor +
                            Math.cos(time * bPoint.seedPack[i] * 5) * chatterFactor,
                        sy(bPoint.y) +
                            Math.cos(time + bPoint.seed2) * mFactor +
                            Math.sin(time * bPoint.seedPack[i + 1] * 5) * chatterFactor
                    );
                    context.lineTo(
                        sx(point.x) +
                            Math.sin(time + point.seed1) * mFactor +
                            Math.cos(time * point.seedPack[i] * 5) * chatterFactor,
                        sy(point.y) +
                            Math.cos(time + point.seed2) * mFactor +
                            Math.sin(time * point.seedPack[i + 1] * 5) * chatterFactor
                    );
                    context.stroke();
                }
            }
        });
    };
};

canvasSketch(sketch, settings);

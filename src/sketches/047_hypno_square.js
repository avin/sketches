import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const margin = width * 0.1;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 5%)';
        context.fillRect(0, 0, width, height);

        context.strokeStyle = 'hsl(0, 0%, 98%)';
        context.lineWidth = width * 0.005 * (Math.cos(time / 2) / 4 + 0.75);

        const minSize = 0;
        let size = 1;
        let x = 0;
        let y = 0;
        context.beginPath();
        context.moveTo(sx(x), sy(y));

        for (let i = 0; i < 1000; i += 1) {
            for (const p of directions) {
                size -= 0.01 * (Math.cos(time / 2) / 4 + 0.75);

                if (size < minSize) {
                    break;
                }

                x += size * p[0];
                y += size * p[1];

                context.lineTo(sx(x), sy(y));
            }
            if (size < minSize) {
                break;
            }
        }
        context.stroke();
    };
};

canvasSketch(sketch, settings);

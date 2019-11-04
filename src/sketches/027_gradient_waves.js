import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = ({ width, height }) => {
    const size = Math.min(width, height);
    const margin = 0;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    let firstTime = true;

    return ({ context, width, height, time }) => {
        let a = 0.2;
        if (firstTime) {
            a = 1;
            firstTime = false;
        }
        context.fillStyle = `hsla(200, 50%, 8%,${a})`;
        context.fillRect(0, 0, width, height);

        context.lineWidth = size * 0.003;

        context.beginPath();
        context.rect(margin, 0, width - margin * 2, height - margin);
        context.clip();

        for (let iy = 0.1; iy < 0.9; iy += 0.01) {
            context.beginPath();
            for (let ix = 0; ix < 1.2; ix += 0.01) {
                let height = (random.noise2D(ix, iy + time / 20, 2) / 2) * 0.2;
                height += (random.noise2D(ix + 20, iy + time / 20, 5) / 2) * 0.02;

                if (ix === 0) {
                    context.moveTo(sx(ix), sy(height + iy));
                } else {
                    context.lineTo(sx(ix), sy(height + iy));
                }
            }
            context.strokeStyle = `hsl(${iy * 360 + 200 + time * 30},100%,50%)`;
            context.stroke();
        }
    };
};

canvasSketch(sketch, settings);

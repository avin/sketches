import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import Collection from '../lib/collection';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

class Star {
    constructor(options) {
        for (const [key, option] of Object.entries(options)) {
            this[key] = option;
        }
    }

    draw() {
        const {
            base: { context, sx, sy },
            x,
            y,
            z,
        } = this;

        // context.fillStyle = `hsl(0, 0%, ${z * 100}%)`;
        context.fillRect(sx(x), sy(y), 10 * this.z, 10 * this.z);
    }

    update() {
        this.x += Math.cos(this.a) / (1000 * (1 - this.z));
        this.y += Math.sin(this.a) / (1000 * (1 - this.z));
        this.z += 1 / 200;
    }
}

const sketch = async ({ width, height, context }) => {
    const margin = 0;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const stars = new Collection();

    const base = {
        context,
        sx,
        sy,
    };

    for (let i = 0; i < 3000; i++) {
        const star = new Star({
            base,
            x: random.range(0, 1),
            y: random.range(0, 1),
            z: random.range(0, 0.3),
        });
        star.a = Math.atan2(star.y - 0.5, star.x - 0.5);

        stars.add(star);
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 0%)';
        context.fillRect(0, 0, width, height);

        context.fillStyle = `hsla(0, 0%, 98%, 0.5)`;

        for (const star of stars) {
            star.update();
            star.draw();

            if (star.x < 0 || star.x > 1 || star.y < 0 || star.y > 1) {
                stars.remove(star);

                const newStar = new Star({
                    base,
                    x: random.range(0.1, 0.9),
                    y: random.range(0.1, 0.9),
                    z: 0.1,
                });
                newStar.a = Math.atan2(
                    newStar.y - (Math.sin(time / 3) / 4 + 0.5),
                    newStar.x - (Math.cos(time / 3) / 4 + 0.5)
                );

                stars.add(newStar);
            }
        }
    };
};

canvasSketch(sketch, settings);

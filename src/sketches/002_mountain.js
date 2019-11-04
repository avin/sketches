const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
    dimensions: [2048, 2048],
};

const sketch = () => {
    const colorsCount = 5;
    const palette = random.shuffle(random.pick(palettes)).slice(0, colorsCount);

    const createLine = f => {
        const points = [];
        const count = 3000;

        for (let x = 500; x < count + 500; x += 1) {
            const u = (x - 500) / (count - 1);

            const radius = random.noise1D((x / count) * 2, f) * 0.5 + 1;

            points.push({
                position: u,
                radius,
            });
        }

        return { points };
    };

    return ({ context: ctx, width, height }) => {
        ctx.fillStyle = 'hsl(0,0%,98%)';
        ctx.fillRect(0, 0, width, height);

        const { points } = createLine(random.range(1, 10) / 10 + 1);
        let diff = 2;

        const countLines = 100;

        const drawLine = diff => {
            points.forEach(({ position, radius }) => {
                ctx.lineTo(position * width, (radius * height) / 2 + diff);
            });
        };
        for (let i = 1; i < countLines; i += 1) {
            diff += i * 1.2;
            const color = random.pick(palette);
            random.setSeed(Math.random());
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = diff;
            drawLine(diff);
            ctx.stroke();
        }
    };
};

canvasSketch(sketch, settings);

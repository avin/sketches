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
        const count = 1000;

        for (let x = 500; x < count + 500; x += 1) {
            const u = (x - 500) / (count - 1);

            const radius = random.noise1D(x / count * 2, f) * 0.5 + 1;

            points.push({
                position: u,
                radius,
            });
        }

        return { points, color: random.pick(palette) };
    };

    return ({ context: ctx, width, height }) => {
        ctx.fillStyle = 'hsl(0,0%,98%)';
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 100; i += 1) {
            random.setSeed(Math.random());
            const { points, color } = createLine(random.range(1, 10) / 10 + 1);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width * 0.003;
            points.forEach(({ position, radius }) => {
                ctx.lineTo(position * width, radius * height / 2);
            });
            ctx.stroke();
        }
    };
};

canvasSketch(sketch, settings);

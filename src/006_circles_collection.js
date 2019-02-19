import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import palettes from 'nice-color-palettes';

const settings = {
    dimensions: [2048, 2048],
};

const sketch = () => {
    const fillStyle = 'hsl(0, 0%, 98%)';
    const palette = random.pick(palettes);

    return ({ context, width, height }) => {
        context.fillStyle = fillStyle;
        context.fillRect(0, 0, width, height);

        const maxCircles = 500;
        const maxCircleRadius = width * 0.01;
        const margin = width * 0.1;

        let circles = [];

        for (let i = 0; i < maxCircles; i += 1) {
            context.beginPath();
            context.lineWidth = margin / 32;
            context.arc(
                random.range(margin, width - margin),
                random.range(margin, height - margin),
                margin / 4,
                0,
                Math.PI * 2,
                false
            );
            context.save();
            if (random.value() > 0.95) {
                context.fillStyle = random.pick(palette);
            }
            context.fill();
            context.restore();
            context.stroke();
        }
    };
};

canvasSketch(sketch, settings);

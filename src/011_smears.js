import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import palettes from 'nice-color-palettes';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = () => {
    const fillStyle = 'hsla(0, 0%, 98%, 0.005)';
    const palette = [...random.pick(palettes), ...random.pick(palettes), ...random.pick(palettes)];

    const size = settings.dimensions[0];

    let odd = false;
    const lines = [];
    const gap = size / 20;

    for (let y = gap; y <= size - gap; y += gap) {
        odd = !odd;
        const line = [];
        for (let x = gap; x <= size - gap; x += gap) {
            const dot = {
                x: x + (odd ? gap / 2 : 0) + random.range(-gap / 4, gap / 4),
                y: y + random.range(-gap / 2, gap / 2),
                color: random.pick(palette),
                speedX: random.value(),
                speedY: random.value(),
                seedX: random.range(0, Math.PI * 2),
                seedY: random.range(0, Math.PI * 2),
                rand: random.range(8, 10),
                rand2: random.range(2, 6),
                speedRand: random.range(2, 5),
            };
            line.push(dot);
        }
        lines.push(line);
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = fillStyle;
        context.fillRect(0, 0, width, height);

        context.lineJoin = 'bevel';

        const moveFactor = width * 0.05;

        function drawTriangle(p) {
            context.beginPath();
            context.lineWidth = 0;
            context.arc(
                p.x +
                    Math.sin(time * p.speedRand + p.seedX) * moveFactor * p.speedX +
                    Math.cos(time * p.rand) +
                    Math.sin(time / 10) * width * 0.1,
                p.y +
                    Math.cos(time * p.speedRand + p.seedY) * moveFactor * p.speedY +
                    Math.sin(time * p.rand) +
                    Math.cos(time / p.rand2) * width * 0.1,
                width * 0.01 * Math.sin(time * 10),
                0,
                Math.PI * 2,
                false
            );

            context.closePath();
            context.fillStyle = p.color;
            context.fill();
        }

        odd = true;

        for (let y = 0; y < lines.length - 1; y+=1) {
            odd = !odd;
            const dotLine = [];
            for (let i = 0; i < lines[y].length; i+=1) {
                dotLine.push(odd ? lines[y][i] : lines[y + 1][i]);
                dotLine.push(odd ? lines[y + 1][i] : lines[y][i]);
            }
            for (let i = 0; i < dotLine.length - 2; i+=1) {
                drawTriangle(dotLine[i]);
            }
        }
    };
};

canvasSketch(sketch, settings);

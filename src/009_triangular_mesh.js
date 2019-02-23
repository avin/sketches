import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import palettes from 'nice-color-palettes';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = () => {
    const fillStyle = 'hsl(0, 0%, 98%)';
    const palette = random.pick(palettes);

    const size = settings.dimensions[0];

    let odd = false;
    const lines = [];
    const gap = size / 8;

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

        function drawTriangle(pointA, pointB, pointC) {
            context.beginPath();
            context.lineWidth = size * 0.005;
            context.moveTo(
                pointA.x + Math.sin(time + pointA.seedX) * moveFactor * pointA.speedX,
                pointA.y + Math.cos(time + pointA.seedY) * moveFactor * pointA.speedY
            );
            context.lineTo(
                pointB.x + Math.sin(time + pointB.seedX) * moveFactor * pointB.speedX,
                pointB.y + Math.cos(time + pointB.seedY) * moveFactor * pointB.speedY
            );
            context.lineTo(
                pointC.x + Math.sin(time + pointC.seedX) * moveFactor * pointC.speedX,
                pointC.y + Math.cos(time + pointC.seedY) * moveFactor * pointC.speedY
            );
            context.lineTo(
                pointA.x + Math.sin(time + pointA.seedX) * moveFactor * pointA.speedX,
                pointA.y + Math.cos(time + pointA.seedY) * moveFactor * pointA.speedY
            );
            context.closePath();
            context.fillStyle = pointA.color;
            context.fill();
            context.stroke();
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
                drawTriangle(dotLine[i], dotLine[i + 1], dotLine[i + 2]);
            }
        }
    };
};

canvasSketch(sketch, settings);

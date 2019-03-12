import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { mapRange } from 'canvas-sketch-util/math';
import Collection from './lib/collection';
import { drawLine } from './lib/ctx';

const settings = {
    dimensions: 'A3',
    orientation: 'landscape',
    animate: true,
};

const sketch = async ({ width, height }) => {
    const lines = new Collection();
    const palette = ['#594f4f', '#547980', '#45ada8', '#9de0ad', '#e5fcc2'];

    const speedRange = [5, 20];
    const sizeRange = [5, 20];
    const thicknessRange = [0.5, 3];

    const fromY = -height;
    const toY = 0;
    const maxLines = 500;

    const cleanLines = () => {
        for (const line of lines) {
            let inScreen = false;

            for (const p of line.points) {
                if (p.x > 0 && p.x < width && p.y > fromY && p.y < height) {
                    inScreen = true;
                }
                if (inScreen) {
                    break;
                }
            }

            if (!inScreen) {
                lines.remove(line);
            }
        }
    };

    const rampUpLine = line => {
        const x = line.points[line.points.length - 1].x;
        const y = line.points[line.points.length - 1].y + line.speed;

        line.points.push({ x, y });
        if (line.points.length > line.size) {
            line.points = line.points.slice(1);
        }
    };

    const createLine = () => {
        const line = {
            points: [{ x: random.range(0, width), y: random.range(fromY, toY) }],
            speed: random.range(speedRange[0], speedRange[1]),
            size: random.rangeFloor(sizeRange[0], sizeRange[1]),
            color: random.pick(palette),
        };

        line.thickness = mapRange(line.speed, speedRange[0], speedRange[1], thicknessRange[0], thicknessRange[1]);

        lines.add(line);
    };

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 10%)';
        context.fillRect(0, 0, width, height);

        for (const line of lines) {
            const lineCoords = line.points.map(p => [p.x, p.y]);
            context.strokeStyle = line.color;
            context.lineWidth = line.thickness;
            drawLine(context, lineCoords);

            rampUpLine(line);
        }

        cleanLines();

        for (let i = lines.size; i < maxLines; i += 1) {
            createLine();
        }
    };
};

canvasSketch(sketch, settings);

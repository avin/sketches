import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import { drawLine, setDrawPolygon } from './lib/ctx';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height, context, canvas }) => {
    const size = width;

    let vertical = true;

    let sepLine;
    const makeSepLine = vertical => {
        sepLine = [];
        const k0 = random.range(size * 0.1, size * 0.9);
        const k1 = random.range(size * 0.1, size * 0.9);

        if (vertical) {
            for (let i = 0; i < size; i += 10) {
                const x = k0 + (k1 - k0) * (i / size);
                sepLine.push([x + random.range(-5, +5), i]);
            }
        } else {
            for (let i = 0; i < size; i += 10) {
                const y = k0 + (k1 - k0) * (i / size);
                sepLine.push([i, y + random.range(-5, +5)]);
            }
        }

        context.lineWidth = 4;
        drawLine(context, sepLine);
    };
    makeSepLine(vertical);

    let bufCanvas = document.createElement('canvas');
    bufCanvas.width = size;
    bufCanvas.height = size;
    // document.body.append(bufCanvas);

    const copyCanvas = () => {
        bufCanvas.getContext('2d').drawImage(canvas, 0, 0);
    };

    copyCanvas();

    let prevSeparationTime = 0;
    let fillColor;
    let pC = 0;
    const setFillColor = () => {
        const c = pC + random.range(80, 180);
        fillColor = `hsl(${c}, 50%,50%)`;
        pC = c;
    };
    setFillColor();

    return ({ context, time }) => {
        if (time - prevSeparationTime > 0.5) {
            vertical = !vertical;
            prevSeparationTime = time;
            setFillColor();
            makeSepLine(vertical);
            copyCanvas();
        } else {
            context.fillStyle = fillColor;
            context.fillRect(0, 0, size, size);
        }

        const move = (time - prevSeparationTime) * 200;

        if (vertical) {
            for (let i = 0; i < 2; i += 1) {
                context.save();

                let area;
                if (i === 0) {
                    area = [[0, 0], ...sepLine.map(si => [si[0] - move, si[1]]), [0, size]];
                } else {
                    area = [[size, 0], ...sepLine.map(si => [si[0] + move, si[1]]), [size, size]];
                }

                setDrawPolygon(context, area, true);
                context.clip();

                if (i === 0) {
                    context.drawImage(bufCanvas, -move, 0);
                } else {
                    context.drawImage(bufCanvas, +move, 0);
                }

                context.restore();
            }
        } else {
            for (let i = 0; i < 2; i += 1) {
                context.save();

                let area;
                if (i === 0) {
                    area = [[0, 0], ...sepLine.map(si => [si[0], si[1] - move]), [size, 0]];
                } else {
                    area = [[0, size], ...sepLine.map(si => [si[0], si[1] + move]), [size, size]];
                }

                setDrawPolygon(context, area, true);
                context.clip();

                if (i === 0) {
                    context.drawImage(bufCanvas, 0, -move);
                } else {
                    context.drawImage(bufCanvas, 0, +move);
                }

                context.restore();
            }
        }
    };
};

canvasSketch(sketch, settings);

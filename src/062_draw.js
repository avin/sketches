import canvasSketch from 'canvas-sketch';
import { drawLine, setDrawPolygon } from './lib/ctx';
import smooth from 'chaikin-smooth';
import { rope } from './lib/shape';
import random from 'canvas-sketch-util/random';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const colors = ['#d9577c', '#e04646', '#e6634c', '#e89851', '#e2ed82', '#76e856', '#3ae056', '#c9fa75', '#b5f26b'];

const sketch = async ({ width, height, canvas }) => {
    let line = [];
    let dirty = false;

    let penColor = colors[0];

    const backCanvas = document.createElement('canvas');
    backCanvas.width = width;
    backCanvas.height = height;

    const backContext = backCanvas.getContext('2d');

    const copyCanvas = () => {
        backContext.drawImage(canvas, 0, 0);
    };

    let active = false;

    canvas.addEventListener('mousedown', e => {
        dirty = true;
        active = true;
        penColor = random.pick(colors);
    });

    canvas.addEventListener('mouseup', e => {
        copyCanvas();
        active = false;

        line = [];
    });

    canvas.addEventListener('mousemove', e => {
        if (!active) {
            return;
        }

        const rect = e.target.getBoundingClientRect();
        const kX = rect.width / width;
        const kY = rect.height / height;
        const x = Math.floor((e.clientX - rect.left) / kX);
        const y = Math.floor((e.clientY - rect.top) / kY);

        line.push([x, y]);
    });

    return ({ context, time }) => {
        context.fillStyle = '#f8ffba';
        context.fillRect(0, 0, width, height);

        context.drawImage(backCanvas, 0, 0);

        if (!dirty) {
            context.save();
            context.font = '100px Sans-Serif';
            context.textAlign = 'center';
            context.strokeText("LET'S DRAW!", width / 2, height / 2);
            context.restore();
        }

        if (line.length > 2) {
            context.strokeStyle = 'hsla(0,0%,20%,0.5)';
            let drawingLine = smooth(line);

            const ropeCoords = drawingLine.map((p, idx) => {
                return [p[0], p[1], 10 * (idx / drawingLine.length) * (Math.cos(idx) / 8 + 0.5)];
            });

            context.fillStyle = penColor;
            setDrawPolygon(context, rope(ropeCoords), true);
            context.fill();

            context.lineWidth = 0.5;
            for (let i = 0; i < 5; i++) {
                const pencilLine = drawingLine.map((p, idx) => {
                    const w = 20 * (idx / drawingLine.length);
                    return [
                        p[0] + random.noise1D(p[0] + i * 20, 0.5 / 100) * w,
                        p[1] + random.noise1D(p[1] + i * 20, 0.5 / 100) * w,
                    ];
                });
                drawLine(context, pencilLine);
            }
        }
    };
};

canvasSketch(sketch, settings);

import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import Stats from 'stats.js';
import { getPixel } from './lib/ctx';

const settings = {
    dimensions: [600, 600],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const textCanvas = document.createElement('canvas');
    textCanvas.width = width;
    textCanvas.height = height;
    const textCanvasCtx = textCanvas.getContext('2d');

    let angle = 0;
    const words = ['ARE', 'YOU', 'READY', '???'];
    const colors = ['#ff00aa', '#aa00ff', '#00aaff', '#ffaa00'];
    let wordIdx = 0;
    let prevTime = 0;

    const drawTextCanvas = () => {
        textCanvasCtx.save();

        textCanvasCtx.fillStyle = '#FFF';
        textCanvasCtx.fillRect(0, 0, width, height);

        textCanvasCtx.translate(width / 2, height / 2);
        textCanvasCtx.fillStyle = '#000';
        textCanvasCtx.font = 'bold 170px Sans-Serif';
        textCanvasCtx.textAlign = 'center';
        textCanvasCtx.textBaseline = 'middle';
        textCanvasCtx.fillText(words[wordIdx], 0, 0);
        textCanvasCtx.restore();
    };
    drawTextCanvas();

    return ({ context, width, height, time }) => {
        stats.begin();

        if (time - prevTime > 0.7) {
            prevTime = time;
            wordIdx += 1;
            if (wordIdx > words.length - 1) {
                wordIdx = 0;
            }
            drawTextCanvas();
        }

        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        angle = Math.cos(time * 4) / 2;

        // angle +=.1

        const textCanvasImageData = textCanvasCtx.getImageData(0, 0, width, height);

        const letterCirclesPath = new Path2D();
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                if (random.value() > 0.96) {
                    const pixel = getPixel(textCanvasImageData, x, y, 0);
                    if (pixel === 0) {
                        const radius = random.rangeFloor(2, 5);

                        const pX = x - width / 2;
                        const pY = y - height / 2;

                        const rX = pX * Math.cos(angle) + pY * Math.sin(angle) + width / 2;
                        const rY = pY * Math.cos(angle) - pX * Math.sin(angle) + height / 2;

                        letterCirclesPath.moveTo(rX + radius, rY);
                        letterCirclesPath.arc(rX, rY, radius, 0, Math.PI * 2, false);
                    }
                }
                if (random.value() > 0.9995) {
                    context.strokeStyle = random.pick(colors);

                    if (random.value() > 0.5) {
                        context.beginPath();
                        context.arc(x, y, random.rangeFloor(2, 5), 0, Math.PI * 2, false);
                        context.stroke();
                    } else {
                        const lineAngle = random.range(-Math.PI, Math.PI);
                        const length = random.rangeFloor(2, 5);

                        context.beginPath();
                        context.lineTo(x + Math.cos(lineAngle) * length, y + Math.sin(lineAngle) * length);
                        context.lineTo(
                            x + Math.cos(lineAngle - Math.PI) * length,
                            y + Math.sin(lineAngle - Math.PI) * length
                        );
                        context.stroke();
                    }
                }
            }
        }

        context.strokeStyle = colors[wordIdx];
        context.stroke(letterCirclesPath);

        stats.end();
    };
};

canvasSketch(sketch, settings);

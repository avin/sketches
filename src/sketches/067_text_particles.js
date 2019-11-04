import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import Stats from 'stats.js';
import { getPixel } from '../lib/ctx';
import Collection from '../lib/collection';
import { createMotionBlur } from '../lib/canvas';

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

    const words = ['CHOOSE', 'YOUR', 'DESTINY', ''];
    const colors = ['#005f6b', '#008c9e', '#00b4cc', '#00dffc'];
    let wordIdx = 0;
    let prevTime = 0;

    const maxBalloons = 1000;

    const balloons = new Collection();
    for (let i = 0; i < maxBalloons; i += 1) {
        balloons.add({
            x: random.range(0, width),
            y: random.range(0, height),
            dx: 0,
            dy: 0,
            r: random.range(2, 5),
            c: random.pick(colors),
        });
    }

    let textCanvasImageData;
    const changeWord = () => {
        textCanvasCtx.save();
        textCanvasCtx.fillStyle = '#FFF';
        textCanvasCtx.fillRect(0, 0, width, height);
        textCanvasCtx.translate(width / 2, height / 2);
        textCanvasCtx.fillStyle = '#000';
        textCanvasCtx.font = 'bold 120px Sans-Serif';
        textCanvasCtx.textAlign = 'center';
        textCanvasCtx.textBaseline = 'middle';
        textCanvasCtx.fillText(words[wordIdx], 0, 0);
        textCanvasCtx.restore();

        textCanvasImageData = textCanvasCtx.getImageData(0, 0, width, height);

        let positions = [];
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                const pixel = getPixel(textCanvasImageData, x, y, 0);
                if (pixel === 0 && random.value() > 0.9) {
                    positions.push([x, y]);
                }
            }
        }

        positions = random.shuffle(positions);
        for (let i = 0; i < maxBalloons; i += 1) {
            const position = positions[i];
            if (position) {
                balloons.items[i].dx = position[0];
                balloons.items[i].dy = position[1];
            } else {
                const target = [random.range(-width / 2, width * 1.5), random.range(-height / 2, height * 1.5)];
                balloons.items[i].dx = target[0];
                balloons.items[i].dy = target[1];
            }
        }
    };
    changeWord();

    const render = ({ context, width, height, time }) => {
        stats.begin();

        if (time - prevTime > 1.5) {
            prevTime = time;
            wordIdx += 1;
            if (wordIdx > words.length - 1) {
                wordIdx = 0;
            }

            changeWord();
        }

        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        for (const balloon of balloons) {
            balloon.x += (balloon.dx - balloon.x) / 10;
            balloon.y += (balloon.dy - balloon.y) / 10;

            context.beginPath();
            context.fillStyle = balloon.c;
            context.arc(balloon.x, balloon.y, balloon.r, 0, Math.PI * 2, false);
            context.fill();
        }

        stats.end();
    };

    return createMotionBlur(render, {
        samplesPerFrame: 4,
        shutterAngle: 0.5,
    });
};

canvasSketch(sketch, settings);

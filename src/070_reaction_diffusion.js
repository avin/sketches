/**
 * Based on article http://www.karlsims.com/rd.html
 */

import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { setDrawPolygon } from './lib/ctx';
import { rope, smoothPath } from './lib/shape';
import Stats from 'stats.js';

const settings = {
    dimensions: [200, 200],
    animate: true,
};

let grid;
let next;

function laplace(field, x, y) {
    let sum = 0;

    const s1 = 0.2;
    const s2 = 0.05;

    sum += grid[x][y][field] * -1;
    sum += grid[x - 1][y][field] * s1;
    sum += grid[x + 1][y][field] * s1;
    sum += grid[x][y + 1][field] * s1;
    sum += grid[x][y - 1][field] * s1;

    sum += grid[x - 1][y - 1][field] * s2;
    sum += grid[x + 1][y - 1][field] * s2;
    sum += grid[x + 1][y + 1][field] * s2;
    sum += grid[x - 1][y + 1][field] * s2;

    return sum;
}

function swap() {
    var temp = grid;
    grid = next;
    next = temp;
}

const sketch = async ({ width, height }) => {
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const size = Math.min(width, height);

    // const dA = 1;
    // const dB = 0.5;
    // const feed = 0.055;
    // const k = 0.062;

    const dA = 0.2097;
    const dB = 0.105;
    const feed = 0.037;
    const k = 0.06;

    grid = new Array(size).fill(0).map(() => new Array(size).fill(0).map(() => ({ a: 1, b: 0 })));
    next = new Array(size).fill(0).map(() => new Array(size).fill(0).map(() => ({ a: 1, b: 0 })));

    for (let i = 95; i < 105; i++) {
        for (let j = 95; j < 105; j++) {
            grid[i][j].b = 1;
        }
    }

    let lastTime = 0;
    return ({ context, width, height, time }) => {
        stats.begin();

        for (let x = 1; x < size - 1; x += 1) {
            for (let y = 1; y < size - 1; y += 1) {
                const a = grid[x][y].a;
                const b = grid[x][y].b;

                next[x][y].a = a + dA * laplace('a', x, y) - a * b ** 2 + feed * (1 - a);
                next[x][y].b = b + dB * laplace('b', x, y) + a * b ** 2 - (k + feed) * b;
            }
        }
        [grid, next] = [next, grid];

        const imageData = context.createImageData(size, size);

        for (let x = 0; x < size; x += 1) {
            for (let y = 0; y < size; y += 1) {
                const pix = (x + y * size) * 4;

                const a = next[x][y].a;
                const b = next[x][y].b;
                const c = ~~((a - b) * 255);

                imageData.data[pix + 0] = c;
                imageData.data[pix + 1] = 200 - c;
                imageData.data[pix + 2] = c;
                imageData.data[pix + 3] = 255;
            }
        }
        context.putImageData(imageData, 0, 0);
        lastTime = time;

        stats.end();
    };
};

canvasSketch(sketch, settings);

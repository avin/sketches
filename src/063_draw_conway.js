import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import Stats from 'stats.js';
import * as dat from 'dat.gui';
import { setPixel } from './lib/ctx';

const settings = {
    dimensions: [600, 600],
    animate: true,
};

const stats = new Stats();
document.body.appendChild(stats.dom);

const sketch = async ({ width, height, canvas }) => {
    let cells;
    const mY = height / 2;
    const mX = width / 2;

    const reset = () => {
        cells = new Array(mY).fill(null).map(() => new Array(mX).fill(0));
    };
    reset();

    let ruleLMin = 2;
    let ruleLMax = 4;

    let ruleEMin = 3;
    let ruleEMax = 3;

    const organisms = {
        organism1: () => {
            ruleLMin = 2;
            ruleLMax = 3;

            ruleEMin = 3;
            ruleEMax = 3;
        },
        organism2: () => {
            ruleLMin = 2;
            ruleLMax = 4;

            ruleEMin = 3;
            ruleEMax = 3;
        },
        organism3: () => {
            ruleLMin = 2;
            ruleLMax = 5;

            ruleEMin = 3;
            ruleEMax = 3;
        },
        organism4: () => {
            ruleLMin = 2;
            ruleLMax = 6;

            ruleEMin = 3;
            ruleEMax = 3;
        },
        organism5: () => {
            ruleLMin = 2;
            ruleLMax = 5;

            ruleEMin = 1;
            ruleEMax = 1;
        },

        reset,
    };

    const gui = new dat.GUI();
    gui.add(organisms, 'organism1').name('Organism 1');
    gui.add(organisms, 'organism2').name('Organism 2');
    gui.add(organisms, 'organism3').name('Organism 3');
    gui.add(organisms, 'organism4').name('Organism 4');
    gui.add(organisms, 'organism5').name('Organism 5');
    gui.add(organisms, 'reset').name('RESET');

    const colors = [
        [0x00, 0x00, 0x00],
        [0x5f, 0x57, 0x4f],
        [0xc2, 0xc3, 0xc7],
        [0xff, 0xa3, 0x00],
        [0xab, 0x52, 0x36],
        [0xff, 0x77, 0xa8],
        [0xff, 0x00, 0x4d],
        [0x83, 0x76, 0x9c],
        [0x7e, 0x25, 0x53],
        [0x29, 0xad, 0xff],
        [0x1d, 0x2b, 0x53],
        [0x00, 0x87, 0x51],
        [0x00, 0xe4, 0x36],
    ];

    let activeColor;

    let dirty = false;

    const cellsAround = [];
    for (let y = -1; y <= 1; y += 1) {
        for (let x = -1; x <= 1; x += 1) {
            if (!(y === 0 && x === 0)) {
                cellsAround.push([y, x]);
            }
        }
    }

    const calcCellsAround = (x, y) => {
        let cellsAroundCount = 0;
        let color;
        cellsAround.forEach(c => {
            let rY = y + c[0];
            if (rY < 0) {
                rY = mY - 1;
            } else if (rY > mY - 1) {
                rY = 0;
            }

            let rX = x + c[1];
            if (rY < 0) {
                rX = mX - 1;
            } else if (rY > mX - 1) {
                rX = 0;
            }
            if (cells[rY][rX]) {
                cellsAroundCount += 1;
                color = cells[rY][rX];
            }
        });
        return [cellsAroundCount, color];
    };

    const tick = () => {
        const newCells = new Array(mY).fill(null).map(() => new Array(mX).fill(0));

        for (let y = 0; y < mY; y += 1) {
            for (let x = 0; x < mX; x += 1) {
                const [cellsAroundCount, color] = calcCellsAround(x, y);
                if (cells[y][x]) {
                    // filled
                    if (cellsAroundCount >= ruleLMin && cellsAroundCount <= ruleLMax) {
                        newCells[y][x] = color;
                    } else {
                        newCells[y][x] = 0;
                    }
                } else {
                    // empty
                    if (cellsAroundCount >= ruleEMin && cellsAroundCount <= ruleEMax) {
                        newCells[y][x] = color;
                    } else {
                        newCells[y][x] = 0;
                    }
                }
            }
        }
        cells = newCells;
    };

    let active = false;

    let bX;
    let bY;

    canvas.addEventListener('mousedown', () => {
        dirty = true;
        active = true;

        bX = undefined;
        bY = undefined;

        activeColor = random.rangeFloor(1, colors.length);
    });

    canvas.addEventListener('mouseup', () => {
        active = false;
    });

    canvas.addEventListener('mouseleave', () => {
        active = false;
    });

    canvas.addEventListener('mousemove', e => {
        if (!active) {
            return;
        }

        const rect = e.target.getBoundingClientRect();
        const kX = rect.width / width;
        const kY = rect.height / height;

        const x = Math.floor((e.clientX - rect.left) / kX / 2);
        const y = Math.floor((e.clientY - rect.top) / kY / 2);

        if (bX !== undefined) {
            const maxI = 100;
            for (let i = 0; i < 100; i += 1) {
                const delta = i / maxI;

                const rx = delta * (x - bX) + x;
                const ry = delta * (y - bY) + y;

                for (let jy = -3; jy < 3; jy += 1) {
                    for (let jx = -3; jx < 3; jx += 1) {
                        if (random.value() > 0.95) {
                            const cy = ~~ry + jy;
                            const cx = ~~rx + jx;

                            if (cy > 0 && cy < mY && cx > 0 && cx < mX) {
                                cells[cy][cx] = activeColor;
                            }
                        }
                    }
                }
            }
        }

        bX = x;
        bY = y;
    });

    return ({ context }) => {
        stats.begin();

        tick();

        context.fillStyle = 'hsl(0,0%,100%)';
        context.fillRect(0, 0, width, height);

        if (!dirty) {
            context.save();
            context.fillStyle = 'hsl(0,80%,80%)';
            context.font = '60px Sans-Serif';
            context.textAlign = 'center';
            context.fillText("LET'S DRAW!", width / 2, height / 2);
            context.restore();
            return;
        }

        const imageData = context.getImageData(0, 0, width, height);

        for (let y = 0; y < mY * 2; y += 1) {
            for (let x = 0; x < mX * 2; x += 1) {
                const cx = ~~(x / 2);
                const cy = ~~(y / 2);
                if (cells[cy][cx]) {
                    const color = colors[cells[cy][cx] - 1];
                    setPixel(imageData, x, y, ...color);
                } else {
                    setPixel(imageData, x, y, 0xff, 0xf1, 0xe8);
                }
            }
        }

        context.putImageData(imageData, 0, 0);

        stats.end();
    };
};

canvasSketch(sketch, settings);

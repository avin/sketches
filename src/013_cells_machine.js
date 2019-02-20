const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [1024, 1024],
    animate: true,
    duration: 3,
};

const sketch = () => {
    //const palette = random.shuffle([...random.pick(palettes), ...random.pick(palettes)]);
    let palette = random.shuffle([
        '#DB3737',
        '#0F9960',
        '#137CBD',
        '#DB2C6F',
        '#D13913',
        '#7157D9',
        '#8F398F',
        '#00B3A4',
        '#29A634',
    ]);

    let ruleLMin;
    let ruleLMax;

    let ruleEMin;
    let ruleEMax;

    const cellsAround = [];
    for (let y = -1; y <= 1; y += 1) {
        for (let x = -1; x <= 1; x += 1) {
            if (!(y === 0 && x === 0)) {
                cellsAround.push([y, x]);
            }
        }
    }

    const mY = 200;
    const mX = 200;

    let cells = new Array(mY).fill(null).map(i => new Array(mX).fill(0));

    const tick = () => {
        let newCells = new Array(mY).fill(null).map(i => new Array(mX).fill(0));

        for (let y = 0; y < mY; y += 1) {
            for (let x = 0; x < mX; x += 1) {
                let cellsAroundCount = 0;
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
                    }
                });
                if (cells[y][x]) {
                    //filled
                    if (cellsAroundCount >= ruleLMin && cellsAroundCount <= ruleLMax) {
                        newCells[y][x] = cellsAroundCount;
                    } else {
                        newCells[y][x] = 0;
                    }
                } else {
                    //empty
                    if (cellsAroundCount >= ruleEMin && cellsAroundCount <= ruleEMax) {
                        newCells[y][x] = cellsAroundCount;
                    } else {
                        newCells[y][x] = 0;
                    }
                }
            }
        }
        cells = newCells;
    };

    const reset = () => {
        morphRules();
        fillCells();
    };

    const fillCells = () => {
        const scheme = random.rangeFloor(1, 3);
        const s = random.rangeFloor(1, 5);

        switch (scheme) {
            case 1: {
                for (let y = 0; y < mY; y += 1) {
                    for (let x = 0; x < mX; x += 1) {
                        if (y > Math.floor(mY / 2) - s && y < Math.floor(mY / 2) + s) {
                            if (x > Math.floor(mX / 2) - s && x < Math.floor(mX / 2) + s) {
                                if (y === Math.floor(mY / 2) || x === Math.floor(mX / 2)) {
                                    cells[y][x] = 1;
                                }
                            }
                        }
                    }
                }
                break;
            }
            case 2: {
                for (let y = Math.ceil(mY / 2) - s + 1; y < Math.ceil(mY / 2) + s; y += 1) {
                    for (let x = Math.ceil(mX / 2) - s; x < Math.ceil(mX / 2) + s; x += 1) {
                        if (Math.abs(Math.ceil(mX / 2) - x) === Math.abs(Math.ceil(mX / 2) - y)) {
                            cells[y][x] = 1;
                        }
                    }
                }
                break;
            }
            case 3: {
                const c = Math.ceil(mY / 2);
                cellsAround.forEach(([y, x]) => {
                    cells[c + y * 2][c + x * 2] = 1;
                });

                break;
            }
        }
    };

    const morphRules = () => {
        ruleLMin = random.rangeFloor(1, 3);
        ruleLMax = random.rangeFloor(3, 3);

        ruleEMin = random.rangeFloor(1, 3);
        ruleEMax = random.rangeFloor(4, 7);
    };

    const reDraw = () => {
        cells = new Array(mY).fill(null).map(i => new Array(mX).fill(0));
    };

    reset();

    let steps = 0;
    let lastMorphStep = 0;

    return ({ context, width, height, time }) => {
        tick();
        steps += 1;
        if (steps % 2 === 0) {
            // Don't render every second step
            return;
        }

        context.fillStyle = 'hsla(0, 0%, 98%, 0.5)';
        context.fillRect(0, 0, width, height);

        const margin = width * 0.1;
        const cellSize = (width - margin * 2) / mY;

        let cellsDrawCount = 0;
        for (let y = 0; y < mY; y += 1) {
            for (let x = 0; x < mX; x += 1) {
                if (cells[y][x]) {
                    context.beginPath();
                    context.fillStyle = palette[cells[y][x]];

                    context.fillRect(
                        Math.floor(x * cellSize + margin),
                        Math.floor(y * cellSize + margin),
                        Math.floor(cellSize + 1),
                        Math.floor(cellSize + 1)
                    );
                    context.stroke();

                    cellsDrawCount += 1;
                }
            }
        }
        if (cellsDrawCount === 0) {
            reset();
        } else {
            if (steps - lastMorphStep > Math.min(mY, mX)) {
                morphRules();
                palette = random.shuffle(palette);
                reDraw();
                fillCells();
                lastMorphStep = steps;
            }
        }
    };
};

canvasSketch(sketch, settings);

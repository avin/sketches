import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';
import { getPointCoordsByAngleAndDistance, isCircleInCircle, twoCirclesIntersection } from './lib/geometry';

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const circeIntersectWithCircles = (circle, anotherCircles) => {
    let intersect = false;
    for (let i = 0; i < anotherCircles.length; i += 1) {
        const aCircle = anotherCircles[i];
        intersect =
            intersect ||
            twoCirclesIntersection([circle.x, circle.y, circle.r], [aCircle.x, aCircle.y, aCircle.r], false) ||
            isCircleInCircle([circle.x, circle.y, circle.r], [aCircle.x, aCircle.y, aCircle.r], true);
        if (intersect) {
            break;
        }
    }
    return intersect;
};

const sketch = async ({ width, height }) => {
    const size = Math.min(width, height);
    const margin = 0;
    const maxTriesFindNewPoint = 100;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const branches = [];
    for (let n = 0; n < 3000; n += 1) {
        const branch = [];
        for (let i = 0; i < 100; i += 1) {
            if (i === 0) {
                branch.push({
                    x: 0,
                    y: 0,
                    r: random.range(0.02,0.03),
                    isRoot: true
                });
            } else {
                const bPoint = branch[i - 1];

                let tries = 0;
                let foundPoint = false;
                while (!foundPoint && tries < maxTriesFindNewPoint) {
                    tries += 1;
                    const rad = random.range(0, Math.PI * 2);

                    const coords = getPointCoordsByAngleAndDistance(rad, bPoint.r, [bPoint.x, bPoint.y]);

                    const point = {
                        x: coords[0],
                        y: coords[1],
                        r: bPoint.r - random.range(0.0005,0.0015),
                    };
                    // Stop if radius too small
                    if (point.r < 0) {
                        break;
                    }

                    if (!circeIntersectWithCircles(point, branch.slice(0, -1))) {
                        branch.push(point);
                        foundPoint = true;
                    }
                }

                // If could not find optimal position - stop
                if (!foundPoint) {
                    break;
                }
            }
        }
        branches.push(branch);
    }

    return ({ context, width, height }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        context.translate(width / 2, height / 2);

        branches.forEach(points => {

            context.beginPath();
            context.strokeStyle = 'hsla(0,0%,10%,0.25)';
            context.lineWidth = .8;
            points.forEach((point, idx) => {
                if (idx === 0) {
                    context.moveTo(sx(point.x), sy(point.y));
                } else {
                    context.lineTo(sx(point.x), sy(point.y));
                }
            });
            context.stroke();
        });
    };
};

canvasSketch(sketch, settings);

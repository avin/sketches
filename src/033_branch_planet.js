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
            isCircleInCircle([circle.x, circle.y, circle.r], [aCircle.x, aCircle.y, aCircle.r]);
        if (intersect) {
            break;
        }
    }
    return intersect;
};

const sketch = async ({ width, height }) => {
    // const size = Math.min(width, height);
    const margin = 0;
    const maxTriesFindNewPoint = 3;
    const tension = 1.1;
    const maxGenerations = 8;
    const minRadius = 0.005;
    const reduceRadiusFactor = 0.95;
    const maxBends = 100;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    let allPoints = [{ x: 0, y: 0, r: 0.09, guiding: true }];
    const branches = [];
    const makeBranch = ({ x, y, r, angle }, beforePoint = null, generation = 1) => {
        if (generation > maxGenerations) {
            return;
        }

        let branch = [];
        for (let i = 0; i < maxBends; i += 1) {
            if (i === 0) {
                const point = {
                    x,
                    y,
                    r,
                    isRoot: true,
                    generation,
                };
                branch.push(point);
                allPoints.push(point);
            } else {
                const bPoint = branch[i - 1];

                let tries = 0;
                let foundPoint = false;
                let point;
                while (!foundPoint && tries < maxTriesFindNewPoint && bPoint) {
                    tries += 1;

                    const rad = random.range(angle - 0.5, angle + 0.5);

                    const coords = getPointCoordsByAngleAndDistance(rad, bPoint.r * tension, [bPoint.x, bPoint.y]);

                    point = {
                        x: coords[0],
                        y: coords[1],
                        r: bPoint.r * reduceRadiusFactor,
                        generation,
                        angle: rad,
                    };
                    // Stop if radius too small
                    if (point.r < minRadius) {
                        break;
                    }

                    const comparingPoints = allPoints.filter(p => {
                        return p !== branch[branch.length - 1];
                    });

                    if (!circeIntersectWithCircles(point, comparingPoints)) {
                        branch.push(point);
                        allPoints.push(point);
                        foundPoint = true;
                    }
                }

                // If could not find optimal position - stop
                if (!foundPoint) {
                    break;
                }

                // From N-th node create sub branches
                if (i > 5) {
                    tries = 0;
                    foundPoint = false;
                    while (!foundPoint && tries < maxTriesFindNewPoint && bPoint) {
                        tries += 1;
                        const rad = random.range(angle - Math.PI / 3, angle + Math.PI / 3);

                        const coords = getPointCoordsByAngleAndDistance(rad, bPoint.r * 1.5, [bPoint.x, bPoint.y]);

                        point = {
                            x: coords[0],
                            y: coords[1],
                            r: bPoint.r / 1.05,
                        };

                        const comparingPoints = allPoints.filter(p => {
                            return p !== branch[branch.length - 1] && p !== branch[branch.length - 2];
                        });

                        if (!circeIntersectWithCircles(point, comparingPoints)) {
                            foundPoint = true;
                            makeBranch(
                                { ...point, r: point.r / 1, angle: rad },
                                { ...branch[branch.length - 2], generation: generation + 1 },
                                generation + 1
                            );
                        }
                    }
                }
            }
        }
        if (branch.length > 1) {
            if (beforePoint) {
                branch = [beforePoint, ...branch];
            }
            branches.push(branch);
        } else {
            allPoints = allPoints.slice(0, -1);
        }
    };

    for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / 9) {
        const angle = Math.atan2(Math.sin(i) / 10, Math.cos(i) / 10);

        makeBranch({ x: Math.cos(i) / 10, y: Math.sin(i) / 10, r: 0.02, angle });
    }

    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        context.lineCap = 'round';

        context.translate(width / 2, height / 2);

        context.rotate(time / 20);

        const kLW = width * 0.005;

        branches.forEach((points, idx) => {
            const generation = points[0].generation;

            context.beginPath();
            context.strokeStyle = 'hsl(0,0%,20%)';
            context.lineWidth = Math.max(kLW / 10, kLW / Math.sqrt(generation));
            points.forEach((point, idx) => {
                if (idx !== 0) {
                    context.beginPath();
                    context.lineWidth = Math.max(context.lineWidth - kLW / 40, kLW / 10);
                    context.moveTo(sx(points[idx - 1].x), sy(points[idx - 1].y));
                    context.lineTo(sx(point.x), sy(point.y));
                    context.stroke();
                }
            });
        });

        branches.forEach(points => {
            const generation = points[0].generation;
            if (generation === 1) {
                const point = points[0];

                context.beginPath();
                context.fillStyle = `#f4313d`;
                context.arc(sx(point.x), sy(point.y), sx(Math.cos(time*5) * 0.002 + 0.01), 0, Math.PI * 2, false);
                context.fill();
            }
        });

        context.lineWidth = width * 0.003;
        allPoints.forEach(point => {
            if (point.guiding) {
                context.beginPath();
                context.fillStyle = `hsl(0,0%,90%)`;
                context.arc(sx(point.x), sy(point.y), sx(point.r + 0.0125), 0, Math.PI * 2, false);
                context.fill();
                context.stroke();
            }
        });
    };
};

canvasSketch(sketch, settings);

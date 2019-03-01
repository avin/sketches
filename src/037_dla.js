import canvasSketch from 'canvas-sketch';
import Stats from 'stats.js';
import random from 'canvas-sketch-util/random';
import { lerp } from 'canvas-sketch-util/math';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const margin = width * 0.1;

    const searchSections = 32;
    const sectionArea = 1 / searchSections;

    const sx = v => lerp(margin, width - margin, v);
    const sy = v => lerp(margin, height - margin, v);

    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const pointRadius = width * 0.002;
    const pointRadiusS = pointRadius / width;

    const staticPoints = new Array(searchSections).fill(0).map(() => new Array(searchSections).fill(0).map(() => []));
    for (let i = -Math.PI; i < Math.PI; i += 0.02) {
        const y = Math.sin(i) / 2 + 0.5;
        const x = Math.cos(i) / 2 + 0.5;

        const iY = Math.floor(y / sectionArea);
        const iX = Math.floor(x / sectionArea);

        staticPoints[iY][iX].push({ x, y });
    }

    const generateFreePoint = () => ({
        x: 0.5 + random.range(-0.05, 0.05),
        y: 0.5 + random.range(-0.05, 0.05),
        a: random.range(0, Math.PI * 2),
    });

    const freePoints = new Array(500).fill(0).map(() => {
        return generateFreePoint();
    });

    let endedProcess = false;

    return ({ context, width, height, time, playhead }) => {
        stats.begin();

        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        context.fillStyle = 'hsl(0, 50%, 50%)';

        staticPoints.forEach(subStaticPointsY => {
            subStaticPointsY.forEach(subStaticPointsX => {
                subStaticPointsX.forEach(p => {
                    context.fillRect(sx(p.x) - pointRadius, sy(p.y) - pointRadius, pointRadius * 2, pointRadius * 2);
                });
            });
        });

        if (!endedProcess) {
            if(freePoints.length < 5000){
                freePoints.push(generateFreePoint());
            }

            context.fillStyle = 'hsl(0, 0%, 20%)';
            freePoints.forEach(p => {
                p.x += random.range(-pointRadiusS / 2, pointRadiusS / width) * Math.cos(p.a);
                p.y += random.range(-pointRadiusS / 2, pointRadiusS / width) * Math.sin(p.a);

                context.fillRect(sx(p.x) - pointRadius, sy(p.y) - pointRadius, pointRadius * 2, pointRadius * 2);
            });

            for (let fpIdx = 0; fpIdx < freePoints.length; fpIdx += 1) {
                const fp = freePoints[fpIdx];

                const iY = Math.floor(fp.y / sectionArea);
                const iX = Math.floor(fp.x / sectionArea);

                let comparePoints = [];
                for (let i1 = -1; i1 <= 1; i1++) {
                    for (let i2 = -1; i2 <= 1; i2++) {
                        if (staticPoints[iY + i1] && staticPoints[iY + i1][iX + i2]) {
                            comparePoints = [...comparePoints, ...staticPoints[iY + i1][iX + i2]];
                        }
                    }
                }

                for (let spIdx = 0; spIdx < comparePoints.length; spIdx += 1) {
                    const sp = comparePoints[spIdx];

                    if (
                        Math.abs(sx(fp.x) - sx(sp.x)) < pointRadius * 2 &&
                        Math.abs(sx(fp.y) - sx(sp.y)) < pointRadius * 2
                    ) {
                        freePoints[fpIdx] = generateFreePoint();

                        const iY = Math.floor(fp.y / sectionArea);
                        const iX = Math.floor(fp.x / sectionArea);

                        staticPoints[iY][iX].push(fp);

                        if (fp.x > 0.4 && fp.x < 0.6 && fp.y > 0.4 && fp.y < 0.6) {
                            endedProcess = true;
                        }

                        break;
                    }
                }
            }
        }

        stats.end();
    };
};

canvasSketch(sketch, settings);

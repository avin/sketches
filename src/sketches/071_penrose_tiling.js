/**
 * Based on
 * https://preshing.com/20110831/penrose-tiling-explained/
 * http://www.math.ubc.ca/~cass/courses/m308-02b/projects/schweber/penrose.html
 */

import canvasSketch from 'canvas-sketch';
import * as dat from 'dat.gui';
import { extendGui } from '../lib/gui';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

const subDivCoord = (c1, c2) => {
    const r = new Array(2);
    for (let i = 0; i < r.length; i += 1) {
        r[i] = c1[i] + (c2[i] - c1[i]) / phi;
    }
    return r;
};

const subdivide = triangles => {
    let result = [];
    for (const [color, a, b, c] of triangles) {
        if (color === 0) {
            // Subdivide red triangle
            const p = subDivCoord(a, b);
            result = [...result, [0, c, p, b], [1, p, c, a]];
        } else {
            // Subdivide blue triangle
            const q = subDivCoord(b, a);
            const r = subDivCoord(b, c);
            result = [...result, [1, r, c, a], [1, q, r, b], [0, r, q, a]];
        }
    }
    return result;
};

const sketch = async ({ width, height }) => {
    let redraw = true;

    const color0 = '#fa6900';
    const color1 = '#69d2e7';

    const params = {
        iterations: 5,
        fillColor: true,
    };

    const gui = new dat.GUI();
    extendGui(gui);

    gui.add(params, 'iterations', 1, 7).step(1);
    gui.add(params, 'fillColor').name('fill color');

    const size = width / 2;

    let contour = [];

    const drawFragment = (
        center,
        context,
        options = {
            iterations: 5,
            fillColor: true,
        }
    ) => {
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, width, height);

        let triangles = [];
        for (let i = 0; i < 10; i += 1) {
            let b = [
                Math.cos(((2 * i - 1) * Math.PI) / 10) * size + center[0], //
                Math.sin(((2 * i - 1) * Math.PI) / 10) * size + center[1], //
            ];
            let c = [
                Math.cos(((2 * i + 1) * Math.PI) / 10) * size + center[0], //
                Math.sin(((2 * i + 1) * Math.PI) / 10) * size + center[1], //
            ];

            contour = [...contour, b, c];

            if (i % 2 === 0) {
                [b, c] = [c, b];
            }
            triangles.push([0, center, b, c]);
        }

        for (let i = 0; i < options.iterations; i += 1) {
            triangles = subdivide(triangles);
        }

        if (options.fillColor) {
            const fillPathC0 = new Path2D();
            const fillPathC1 = new Path2D();

            for (const [color, a, b, c] of triangles) {
                const path = color === 1 ? fillPathC1 : fillPathC0;

                path.moveTo(a[0], a[1]);
                path.lineTo(b[0], b[1]);
                path.lineTo(c[0], c[1]);
            }

            context.fillStyle = color1;
            context.fill(fillPathC1);
            context.fillStyle = color0;
            context.fill(fillPathC0);
        }

        const linesPath = new Path2D();
        const linesPathC0 = new Path2D();
        const linesPathC1 = new Path2D();
        for (const [color, a, b, c] of triangles) {
            linesPath.moveTo(c[0], c[1]);
            linesPath.lineTo(a[0], a[1]);
            linesPath.lineTo(b[0], b[1]);

            // OPTIONAL! Just glitch solver
            if (options.fillColor) {
                const path = color === 1 ? linesPathC1 : linesPathC0;
                path.moveTo(b[0], b[1]);
                path.lineTo(c[0], c[1]);
            }
        }

        // OPTIONAL! Just glitch solver
        if (options.fillColor) {
            context.lineWidth = 1;
            context.strokeStyle = color1;
            context.stroke(linesPathC1);
            context.strokeStyle = color0;
            context.stroke(linesPathC0);
        }

        context.lineWidth = 1;
        context.strokeStyle = '#000';
        context.stroke(linesPath);
    };

    const bufCanvas = document.createElement('canvas');
    bufCanvas.width = size * 1.9;
    bufCanvas.height = size * 2;
    const bufCanvasContext = bufCanvas.getContext('2d');
    drawFragment([(size * 1.9) / 2, size], bufCanvasContext, params);

    gui.onChange(() => {
        redraw = true;
        drawFragment([(size * 1.9) / 2, size], bufCanvasContext, params);
    });

    return ({ context }) => {
        if (redraw) {
            context.fillStyle = '#FFF';
            context.fillRect(0, 0, width, height);

            context.drawImage(bufCanvas, size * 0.05, 0);
            redraw = false;
        }
    };
};

canvasSketch(sketch, settings);

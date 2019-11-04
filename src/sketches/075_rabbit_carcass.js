import canvasSketch from 'canvas-sketch';
import { vec3, mat4 } from 'gl-matrix';
import * as bunny from 'bunny';
import createCamera from 'perspective-camera';
import { drawLine } from '../lib/ctx';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ context, width, height }) => {
    const initView = mat4.create();

    // const perspectiveView = mat4.create();
    // mat4.perspective(perspectiveView, 0.5, 1, 1, 1000);

    return ({ context, time }) => {
        context.fillStyle = 'hsla(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        context.lineWidth = 0.3;

        const modelView = mat4.clone(initView);

        const translation = vec3.create();
        vec3.set(translation, width / 2, height, 0);
        mat4.translate(modelView, modelView, translation);

        mat4.rotateX(modelView, modelView, Math.PI);
        mat4.rotateY(modelView, modelView, time / 5);

        const sF = 90;
        mat4.scale(modelView, modelView, [sF, sF, sF]);

        const path = new Path2D();

        for (let n = 0; n < bunny.cells.length; n += 1) {
            const bunnyCell = bunny.cells[n];

            for (let i = 0; i < bunnyCell.length; i += 1) {
                const pointIdx = bunnyCell[i];
                const pT = vec3.clone(bunny.positions[pointIdx]);
                vec3.transformMat4(pT, pT, modelView);

                for (let j = -Math.PI; j < Math.PI; j += Math.PI) {
                    const x = pT[0] + Math.cos(time * 10 + n + j) * 5;
                    const y = pT[1] + Math.sin(time * 10 + n + j) * 5;
                    if (i === 0) {
                        path.moveTo(x, y);
                    } else {
                        path.lineTo(x, y);
                    }
                }
            }
        }

        context.stroke(path);
    };
};

canvasSketch(sketch, settings);

import canvasSketch from 'canvas-sketch';
import { vec3, mat4 } from 'gl-matrix';
import { clamp } from 'canvas-sketch-util/math';
import { drawLine } from './lib/ctx';
import { rope } from './lib/shape';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ context, width, height }) => {
    const cubeVertices = [
        [-1, -1, +1],
        [-1, -1, -1],
        [+1, -1, -1],
        [+1, -1, +1],
        [+1, +1, +1],
        [+1, +1, -1],
        [-1, +1, -1],
        [-1, +1, +1],
    ];

    const cubeEdges = [];

    for (let n = 0; n < cubeVertices.length; n += 1) {
        for (let m = 0; m < cubeVertices.length / 2; m += 1) {
            const i = (n + m) % cubeVertices.length;

            cubeEdges.push([n, i]);
        }
    }

    const initView = mat4.create();

    const backCanvas = document.createElement('canvas');
    backCanvas.width = width;
    backCanvas.height = height;
    const backCanvasContext = backCanvas.getContext('2d');
    const backContextImageData = backCanvasContext.getImageData(0,0,width, height);

    let lastTime = 0;

    context.fillStyle = 'hsla(0, 0%, 98%)';
    context.fillRect(0, 0, width, height);

    return ({ context, time }) => {

        context.drawImage(backCanvas, 0, 0);

        context.lineWidth = 1;
        context.strokeStyle = '#202B33';

        const total = 5;
        const path = new Path2D();
        for (let i = 0; i < total; i += 1) {
            const modelView = mat4.clone(initView);

            mat4.rotateX(modelView, modelView, Math.cos(time) + time / 10);
            mat4.rotateY(modelView, modelView, Math.sin(time));
            mat4.rotateZ(modelView, modelView, Math.sin(time + Math.PI / 4));
            const sF = (Math.cos(time) / 2 + 1.5) / Math.sqrt(i/2);
            mat4.scale(modelView, modelView, [sF, sF, sF]);

            context.fillStyle = `hsl(${time}, 80%, 50%)`;

            const cubeVerticesMorphed = cubeVertices.map(p => {
                const pT = [];
                vec3.transformMat4(pT, p, modelView);

                return pT;
            });

            cubeEdges.forEach(edge => {
                const lineCoords = edge.map(pN => {
                    return [cubeVerticesMorphed[pN][0] * 100 + width / 2, cubeVerticesMorphed[pN][1] * 100 + width / 2];
                });
                lineCoords.forEach(p => {
                    path.lineTo(p[0], p[1]);
                });
            });
        }

        context.stroke(path);

        const contextImageData = context.getImageData(0, 0, width, height);


        if(time-lastTime > .05){
            lastTime = time;

            for (let i = 0; i < backContextImageData.data.length; i += 4) {
                for (let j = 0; j < 3; j += 1) {
                    backContextImageData.data[i + j] = clamp(contextImageData.data[i + j] + 20, 0, 255);
                }
                backContextImageData.data[i + 3] = 255;
            }
            backCanvasContext.putImageData(backContextImageData, 0, 0);
        }

    };
};

canvasSketch(sketch, settings);

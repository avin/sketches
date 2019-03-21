/**
 * A WebGL example of a dithered noise blob/sphere, using Regl.
 * @author Matt DesLauriers (@mattdesl)
 */

const canvasSketch = require('canvas-sketch');

// Import geometry & utilities
const createRegl = require('regl');
const createPrimitive = require('primitive-icosphere');
const createCamera = require('perspective-camera');
const glslify = require('glslify');
const hexRgb = require('hex-rgb');
const glMatrix = require('gl-matrix');

// Utility to convert hex string to [ r, g, b] floats
const hexToRGB = hex => {
    const rgba = hexRgb(hex, { format: 'array' });
    return rgba.slice(0, 3).map(n => n / 255);
};

const settings = {
    // Output size
    dimensions: [600, 600],

    // Setup render loop
    animate: true,
    // duration: 7,
    fps: 24,

    // Ensure we set up a canvas with WebGL context, not 2D
    context: 'webgl',

    // We can pass down some properties to the WebGL context...
    attributes: {
        antialias: true, // turn on MSAA
    },
};

const sketch = ({ gl, canvasWidth, canvasHeight }) => {
    const regl = createRegl({ gl });

    const drawTriangle = regl({
        frag: /* language=GLSL*/ `
            precision mediump float;
            
            uniform float uTime;
            
            varying vec2 pos;
            
            void main() {
                gl_FragColor = vec4(
                    cos(pos.x * 20. - uTime * 5.)/4. + sin(uTime*5.)/4.+0.5, 
                    cos(uTime * 5.)/4.+0.2, 
                    .5, 
                    .5
                );
            }
        `,

        vert: /* language=GLSL*/ `
            attribute vec2 position;
            uniform mat4 modelMatrix;
            uniform mat4 viewMatrix;
            varying vec2 pos;
            void main() {
                pos = position;
                mat4 myView = mat4(
                    1.0, .0, .0, .0, 
                    .0, 1.0, .0, .0, 
                    .0, .0, 1.0, .0, 
                    .0, .0, .0, 1.0 
                );
                gl_Position = viewMatrix * modelMatrix * vec4(position, -1, 1);
            }
        `,

        attributes: {
            position: [[-1, -1], [0, 1], [1, -1]],
        },
        uniforms: {
            uTime: regl.prop('uTime'),
            modelMatrix: regl.prop('modelMatrix'),
            viewMatrix: regl.prop('viewMatrix'),
        },

        count: 3,
    });

    return ({ viewportWidth, viewportHeight, time, playhead }) => {
        // On each tick, update regl timers and sizes
        regl.poll();

        // // Clear backbuffer with black
        // regl.clear({
        //     color: backgroundRGBA,
        //     depth: 1,
        //     stencil: 0
        // });

        const modelMatrix = glMatrix.mat4.create();
        const viewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(modelMatrix);
        glMatrix.mat4.identity(viewMatrix);
        glMatrix.mat4.scale(modelMatrix, modelMatrix, [Math.cos(time),1,1,1]);


        drawTriangle({
            uTime: time,
            modelMatrix,
            viewMatrix,
        });
    };
};

canvasSketch(sketch, settings);

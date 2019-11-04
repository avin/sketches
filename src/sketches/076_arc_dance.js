const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const frag = require('../shaders/009_arc_dance.glsl');

const settings = {
    context: 'webgl',
    animate: true,
};

const sketch = ({ gl, width, height, canvas }) => {
    let mx = width / 2;
    let my = height / 2;

    canvas.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    });

    return createShader({
        gl,
        frag,
        uniforms: {
            u_time: ({ time }) => time,
            u_resolution: () => [width, height],
            u_mouse: () => [mx, my],
        },
    });
};

canvasSketch(sketch, settings);

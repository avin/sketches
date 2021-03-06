const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const frag = require('../shaders/005_smile_shader.glsl');

const settings = {
    context: 'webgl',
    animate: true,
};

const sketch = ({ gl, width, height }) => {
    return createShader({
        gl,
        frag,
        uniforms: {
            u_time: ({ time }) => time,
            u_resolution: () => [width, height],
        },
    });
};

canvasSketch(sketch, settings);

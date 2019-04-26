const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');

export default function renderShader(shaderSrc) {
    const frag = `    
#ifdef GL_ES 
precision mediump float; 
#endif 

uniform vec2 iResolution; 
uniform vec4 iMouse; 
uniform float iTime; 

${shaderSrc}

void main() {     
    vec4 fragColor = vec4(0.);
    mainImage(fragColor, gl_FragCoord.xy);
    
    gl_FragColor = fragColor;    
}`;

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
                iTime: ({ time }) => time + 1000,
                iResolution: () => [width, height],
                iMouse: () => [mx, my, 0, 0],
            },
        });
    };

    canvasSketch(sketch, settings);
}

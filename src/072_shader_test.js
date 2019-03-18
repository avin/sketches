const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
    context: 'webgl',
    animate: true,
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float u_time;
  varying vec2 vUv;

  void main () {
    vec3 col1 = vec3(1.0, 0.0, 0.0);
	vec3 col2 = vec3(0.0, 0.0, 1.0);
	
	vec3 pixel;
	if (vUv.y < cos(vUv.x * cos(u_time) * 5.0 + u_time * 5.0) / 4.0 + 0.5) {
		pixel = mix(col1, col2, cos(u_time * 1.0) / 2.0 + 0.5);
	} else {
		pixel = mix(col2, col1, cos(u_time * 1.0) / 2.0 + 0.5);
	}
	
	gl_FragColor = vec4(pixel, 1.0);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
    // Create the shader and return it
    return createShader({
        // Pass along WebGL context
        gl,
        // Specify fragment and/or vertex shader strings
        frag,
        // Specify additional uniforms to pass down to the shaders
        uniforms: {
            // Expose props from canvas-sketch
            u_time: ({ time }) => time,
        },
    });
};

canvasSketch(sketch, settings);

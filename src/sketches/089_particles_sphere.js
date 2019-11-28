const THREE = require('three');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');
const glsl = require('glslify');

const canvasSketch = require('canvas-sketch');

const settings = {
    animate: true,
    context: 'webgl',
};

// language=GLSL
const fragmentShader = `
precision highp float;

varying vec3 vpos;

uniform vec2 iResolution;
uniform float iTime;

varying float fogDepth;
varying float size;
uniform float fogDensity;

uniform mat3 uvTransform;

#define PI 3.1415926
#define TAU 6.2831852
#define BLACK_COL vec3(24,32,38)/255.

#define rand1(p) fract(sin(p* 78.233)* 43758.5453)
#define hue(h) clamp( abs( fract(h + vec4(3,2,1,0)/3.) * 6. - 3.) -1. , 0., 1.)

void mainImage( out vec4 fragColor, in vec2 fragCoord){
  vec2 uv = (uvTransform * vec3(gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1)).xy - .5;

  float g = length(uv) * size;

  g = (size*.1) / smoothstep(.0, size*.5, g);

  fragColor = vec4(hue(length(vpos) * size * .75).rgb * g, g*.75);
}


varying vec2 vUv;

void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
}
`;

// language=GLSL
const vertexShader = glsl`    
#pragma glslify: noise = require('glsl-noise/simplex/3d')

varying vec2 vUv;
varying vec3 vpos;
varying float size;

uniform float iTime;
uniform float pSize;

void main() {
  vUv = uv;
  float t = iTime*.025;

  vpos = position;

  vpos.xyz *= 1. + noise(position*1.5 + vec3(iTime*.5))*.15;
  vpos.xyz *= 1. + noise(position*5.5 + vec3(iTime*.5))*.075;
  vpos.xyz *= 1. + noise(position*10.5 + vec3(iTime*.5))*.025;

  
  size = pSize;
  gl_PointSize = pSize + (length(vpos)-.75)*10.;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4( vpos, 1.0 );
}
`;

const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });

    // WebGL background color
    renderer.setClearColor('hsl(100, 10%, 10%)', 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(2, -1.5, -1);

    camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene();

    // create the particle variables
    const particles = new THREE.OctahedronGeometry(1, 7);

    const shaderPoint = THREE.ShaderLib.points;
    const uniforms = {
        ...shaderPoint.uniforms,
        iTime: { value: 0 },
        pSize: { value: 4 },
    };

    const pMaterial = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,

        blending: THREE.AdditiveBlending,
        fragmentShader,
        vertexShader,
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    particleSystem.sortParticles = true;

    scene.add(particleSystem);

    // draw each frame
    return {
        // Handle resize events here
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },
        // Update & render your scene here
        render({ time, dimensions }) {
            pMaterial.uniforms.iTime.value = time * 0.75;

            controls.update();
            renderer.render(scene, camera);
        },
        // Dispose of events & renderer for cleaner hot-reloading
        unload() {
            controls.dispose();
            renderer.dispose();
        },
    };
};

canvasSketch(sketch, settings);

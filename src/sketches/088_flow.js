const THREE = require('three');

global.THREE = THREE;

const canvasSketch = require('canvas-sketch');
const glsl = require('glslify');

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
uniform float fogDensity;

#define PI 3.1415926
#define TAU 6.2831852
#define BLACK_COL vec3(24,32,38)/255.

#define rand1(p) fract(sin(p* 78.233)* 43758.5453)
#define hue(h) clamp( abs( fract(h + vec4(3,2,1,0)/3.) * 6. - 3.) -1. , 0., 1.)

void mainImage( out vec4 fragColor, in vec2 fragCoord){

  float cx = ceil(iResolution.x / 2.0);
  float cy = ceil(iResolution.y / 2.0);

  float x = fragCoord.x - cx;
  float y = fragCoord.y - cy;

  vec4 background = vec4(vec3(0.129, 0.168, 0.2), 1.0);

  // ======= Lines + Bold lines    
  background.xyz += step(1.0 - 1.0 / 10.0, fract(x / 10.0)) * 0.1;
  background.xyz += step(1.0 - 1.0 / 50.0, fract(x / 50.0)) * 0.2;

  background.xyz += step(1.0 - 1.0 / 10.0, fract(y / 10.0)) * 0.1;
  background.xyz += step(1.0 - 1.0 / 50.0, fract(y / 50.0)) * 0.2;

  // ======= AXES
  float xb = step(abs(x) - 0.5, 0.0);
  float yb = step(abs(y) - 0.5, 0.0);
  background.rgb = mix(background.rgb, vec3(0.964, 0.447, 0.443), (xb));
  background.rgb = mix(background.rgb, vec3(0.341, 0.8, 0.560), (yb));

  // ======= CENTER
  float cb = (1.0 - step(0.0, abs(x) - 2.5)) * (1.0 - step(0.0, abs(y) - 2.5));
  background.rgb = mix(background.rgb, vec3(1.0, 1.0, 1.0), cb);

  fragColor = background;

  fragColor = vec4(hue(vpos.z*.2 + .725).rgb, .25 - vpos.y*0.0125);     
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

uniform float iTime;

void main() {
  vUv = uv;
  float t = iTime*.025;

  vpos = position;
  
  vec3 nvpos = vpos + vec3(0, iTime*20., 0);

  vpos.z += noise(vec3(nvpos.xy*.1, t*5.5))*2.;
  vpos.z += noise(vec3(nvpos.xy*.5, t*5.5))*.25;
  
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4( vpos, 1.0 );
}
`;

const sketch = ({ context }) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });

    renderer.setClearColor('hsl(200, 40%, 10%)', 1);

    const camera = new THREE.PerspectiveCamera(40, 10, 2.00091, 1000);
    camera.position.set(0, 7, 57);

    const scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(100, 100, 200, 200);
    const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(100, 100, 1) },
    };
    const material = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        wireframe: true,
        vertexShader,
        fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    scene.add(light);

    return {
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },

        render({ time }) {
            material.uniforms.iTime.value = time;

            renderer.render(scene, camera);
        },

        unload() {
            renderer.dispose();
        },
    };
};

canvasSketch(sketch, settings);

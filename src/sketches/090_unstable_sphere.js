const THREE = require('three');
const random = require('canvas-sketch-util').random;

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
varying float hp;
varying float hp2;
varying float hp3;

uniform vec2 iResolution;
uniform float iTime;
uniform float pSize;

uniform mat3 uvTransform;

void mainImage( out vec4 fragColor, in vec2 fragCoord){
  vec2 uv = (uvTransform * vec3(gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1)).xy - .5;

  float t = iTime*.5 + hp; // Делаем время для точки такое же как в vertexShader
  
  float g = length(uv) * pSize;
  float gx = .05 / smoothstep(.0, pSize, g);
  
  float tr = step(.3, hp2);
  if(tr == 0.){
    // Для отрывающихся точке будем делать затухание
    tr = 1. - fract(t);
  }

  // Прозрачность считаем от hp3 чтоб все точки были с разной яркостью
  fragColor = vec4(vec3(gx) / g, hp3 * tr);
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
varying float hp;
varying float hp2;
varying float hp3;

uniform float iTime;
uniform float pSize;

float hash(vec3 p)// replace this by something better
{
  p  = fract(p*0.3183099+.1);
  p *= 17.0;
  return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}

void main() {
  vUv = uv;
  
  hp = hash(position); // Рандомный фактор для точки по позиции
  hp2 = hash(position*3.3); // Дополнительный рандомный фактор
  hp3 = hash(position*6.6); // Еще один рандомный фактор
  
  float t = iTime*.5 + hp; // Замедляем время и прибавляем рандомный фактор - у этой точки будет "своё" время

  vpos = position;

  // индивидульный рандомнеый vec3 для точки для определения движения точки
  vec3 npp = vec3(hash(position), hash(position*10.), hash(position*20.))*2.;
  
  // Фактор смещения через симплексный шум
  float nF = noise((npp + vec3(iTime*.525)) * 1.) * (.25 + fract(t))*.5;
  
  // фактор движения - определяем только часть точек которые будут летать
  float mF = step(hp2, .3);
  
  // Дивгаем точки (те которые попали в mF, остальные на месте)
  vpos.xyz = vpos.xyz + (vpos.xyz * fract(t)*2. ) * mF;

  // Добавляем к отлетающей точке фактор плавающего смещения
  vpos.xyz += nF * mF;
  
  gl_PointSize = pSize;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4( vpos, 1.0 );
}
`;

const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });

    renderer.setClearColor('hsl(100, 10%, 10%)', 1);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(2, -1.5, -1);

    camera.lookAt(new THREE.Vector3());
    const controls = new THREE.OrbitControls(camera, context.canvas);

    const scene = new THREE.Scene();

    const particles = new THREE.OctahedronGeometry(1, 5);
    particles.vertices = particles.vertices.map(v => {
        v.x += (Math.random() - 0.5) * 0.05;
        v.y += (Math.random() - 0.5) * 0.05;
        v.z += (Math.random() - 0.5) * 0.05;
        return v;
    });

    const shaderPoint = THREE.ShaderLib.points;
    const uniforms = {
        ...shaderPoint.uniforms,
        iTime: { value: 0 },
        pSize: { value: 10 },
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

    return {
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },

        render({ time, dimensions }) {
            pMaterial.uniforms.iTime.value = time * 0.175;

            camera.position.x = 5 * Math.cos(time * 0.125);
            camera.position.z = 5 * Math.sin(time * 0.125);

            controls.update();
            renderer.render(scene, camera);
        },

        unload() {
            controls.dispose();
            renderer.dispose();
        },
    };
};

canvasSketch(sketch, settings);

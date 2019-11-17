const THREE = require('three');
const random = require('canvas-sketch-util/random');

global.THREE = THREE;

require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');

const settings = {
    animate: true,
    context: 'webgl',
};

const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });

    // WebGL background color
    renderer.setClearColor('hsl(100, 10%, 10%)', 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(40, 10, 0.91, 1000);
    camera.position.set(-10, 5, -10);
    camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene();

    // create the particle variables
    const particleCount = 200;
    const particles = new THREE.Geometry();

    const shaderPoint = THREE.ShaderLib.points;
    const uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);

    const pMaterial = new THREE.ShaderMaterial({
        uniforms,
        defines: {
            USE_FOG: true,
            FOG_EXP2: true,
        },
        transparent: true,
        depthWrite: false,

        blending: THREE.SubtractiveBlending,
        vertexShader: shaderPoint.vertexShader,

        fragmentShader: require('./085_particles_wave/shaders/frag.glsl'),
    });

    const cubeSize = 10;
    const cubeSizeHalf = cubeSize / 2;
    // now create the individual particles
    for (let x = 0; x < particleCount; x += 1) {
        for (let y = 0; y < particleCount; y += 1) {
            const pX = (random.gaussian() * cubeSize - cubeSizeHalf) * 0.2;
            const pY = 0;
            const pZ = (random.gaussian() * cubeSize - cubeSizeHalf) * 0.2;
            const particle = new THREE.Vector3(pX, pY, pZ);

            particles.vertices.push(particle);
        }
    }

    const particleSystem = new THREE.Points(particles, pMaterial);
    particleSystem.sortParticles = true;
    particleSystem.geometry.dynamic = true;

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
        render({ time, pixelRatio }) {
            const t = time * 0.25;

            particleSystem.geometry.vertices.forEach(i => {
                i.y = random.noise3D(i.x, i.z, 0.1 + t * 1.1, 0.5) * 0.5;
                i.y += random.noise3D(i.x, i.z, 0.1 + t * 0.21, 1.5) * 0.15;
            });
            particleSystem.geometry.verticesNeedUpdate = true;

            uniforms.size.value = 60 * pixelRatio;

            camera.position.x = 11 * Math.cos(t * 0.25);
            camera.position.z = 11 * Math.sin(t * 0.25);

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

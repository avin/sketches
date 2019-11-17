const THREE = require('three');

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
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(0, 0, -30);
    camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene();

    // create the particle variables
    const particleCount = 10000;
    const particles = new THREE.Geometry();

    const shaderPoint = THREE.ShaderLib.points;
    const uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);
    uniforms.size.value = 100;
    uniforms.scale.value = 5; // in my case value is 350

    const pMaterial = new THREE.ShaderMaterial({
        uniforms: {
            ...uniforms,
        },
        defines: {
            USE_FOG: true,
            FOG_EXP2: true,
        },
        transparent: true,
        // alphaTest: .4,
        depthWrite: false,
        // depthTest: true,
        blending: THREE.AdditiveBlending,
        vertexShader: shaderPoint.vertexShader,

        // fragmentShader: shaderPoint.fragmentShader
        fragmentShader: require('./084_particles_cube/shaders/frag.glsl'),
    });

    const cubeSize = 10;
    const cubeSizeHalf = cubeSize / 2;
    // now create the individual particles
    for (let p = 0; p < particleCount; p += 1) {
        const pX = Math.random() * cubeSize - cubeSizeHalf;
        const pY = Math.random() * cubeSize - cubeSizeHalf;
        const pZ = Math.random() * cubeSize - cubeSizeHalf;
        const particle = new THREE.Vector3(pX, pY, pZ);

        particles.vertices.push(particle);
    }

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
            const t = time * 0.5;

            const mmax = Math.max(dimensions[1], dimensions[0]);
            const mmin = Math.min(dimensions[1], dimensions[0]);

            uniforms.size.value = (mmin / mmax) * 100;

            camera.position.x = 11 * Math.cos(t);
            camera.position.z = 7 * Math.sin(t * 0.5);
            camera.position.y = 18 * Math.sin(t * 0.7 + 20);

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

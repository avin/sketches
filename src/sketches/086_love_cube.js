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
    renderer.setClearColor('hsl(200, 40%, 10%)', 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(40, 10, 0.91, 1000);
    camera.position.set(-10, 100, -10);
    camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene();

    const starsGeometry = new THREE.Geometry();

    for (let i = 0; i < 10000; i += 1) {
        const star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread(100);
        star.y = THREE.Math.randFloatSpread(100);
        star.z = THREE.Math.randFloatSpread(100);

        starsGeometry.vertices.push(star);
    }

    const shaderPoint = THREE.ShaderLib.points;
    const uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);

    uniforms.time = {
        value: 0,
    };

    uniforms.size.value = 100;

    const pMaterial = new THREE.ShaderMaterial({
        uniforms,
        // defines: {
        //     USE_FOG: true,
        //     FOG_EXP2: true,
        // },
        transparent: true,
        depthWrite: false,

        blending: THREE.AdditiveBlending,

        vertexShader: require('./086_love_cube/shaders/vert.glsl'),
        fragmentShader: require('./086_love_cube/shaders/frag.glsl'),
    });

    const particles = new THREE.Points(starsGeometry, pMaterial);

    scene.add(particles);

    return {
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },

        render({ time }) {
            const t = time;

            pMaterial.uniforms.time.value = t * 10;

            // particles.geometry.verticesNeedUpdate = true;

            camera.position.x = 210 * Math.cos(t * 0.125);
            camera.position.z = 210 * Math.sin(t * 0.125);

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

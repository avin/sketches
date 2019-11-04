import canvasSketch from 'canvas-sketch';
import Renderer from './083_dna/Renderer';

const settings = {
    context: 'webgl',
    animate: true,
};

const sketch = ({ canvas }) => {
    const renderer = new Renderer();

    renderer.initialize(canvas);
    renderer.loadScene();
    renderer.run();

    return {
        resize() {
            renderer.engine.resize();
        },
    };
};

canvasSketch(sketch, settings);

import canvasSketch from 'canvas-sketch';
import Stats from 'stats.js';

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    return ({ context, width, height, time, playhead }) => {
        stats.begin();

        // ... DRAW CODE ...

        stats.end();
    };
};

canvasSketch(sketch, settings);

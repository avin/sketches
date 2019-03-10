import canvasSketch from 'canvas-sketch';
import { setPixel } from './lib/ctx';
import WebCam from './lib/webcam';

let cam;

const settings = {
    dimensions: [720, 720],
    animate: true,
};

const sketch = async () => {
    return ({ context, width, height }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        const camImageData = cam.getImageData();

        context.font = '10px Monospace';
        context.fillStyle = '#000';

        const imageData = context.getImageData(0, 0, width, height);

        for (let y = 1; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                const iy = Math.floor(camImageData.height * y / height);
                const ix = Math.floor(camImageData.width * x / width);

                const pixelIdx = camImageData.width * 4 * iy + 4 * ix;

                const r = camImageData.data[pixelIdx];
                const g = camImageData.data[pixelIdx + 1];
                const b = camImageData.data[pixelIdx + 2];

                setPixel(imageData, x, y + ~~(Math.cos(x / 10) * 10), r, g, b);
            }
        }

        context.putImageData(imageData, 0, 0);
    };
};

(async () => {
    cam = new WebCam();
    await cam.start();

    settings.dimensions[0] = cam.width;
    settings.dimensions[1] = cam.height;

    canvasSketch(sketch, settings);
})();

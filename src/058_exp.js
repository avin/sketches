import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { setPixel } from './lib/ctx';
import WebCam from './lib/webcam';
import { hslToRgb, rgbToHsl } from './lib/color';

let cam;

const settings = {
    dimensions: [720, 720],
    animate: true,
};

const sketch = async () => {
    return ({ context, width, height, time }) => {
        context.fillStyle = 'hsl(0, 0%, 98%)';
        context.fillRect(0, 0, width, height);

        const camImageData = cam.getImageData();

        context.font = '10px Monospace';
        context.fillStyle = '#000';

        const imageData = context.getImageData(0, 0, width, height);

        for (let y = 1; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                const iy = ~~(camImageData.height * y / height);
                const ix = ~~(camImageData.width * x / width);

                const pixelIdx = camImageData.width * 4 * iy + 4 * ix;

                const r = camImageData.data[pixelIdx];
                const g = camImageData.data[pixelIdx + 1];
                const b = camImageData.data[pixelIdx + 2];

                const hsl = rgbToHsl(r, g, b);
                hsl[0] += (time)%1;
                hsl[1] = .8;

                const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

                setPixel(imageData, [x, y], rgb);
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

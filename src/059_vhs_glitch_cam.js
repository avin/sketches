import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import { setPixel } from './lib/ctx';
import WebCam from './lib/webcam';
import { getLuminance, hslToRgb, rgbToHsl } from './lib/color';

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

        const imgDataBack = context.createImageData(width, height);
        const imgDataRed = context.createImageData(width, height);
        const imgDataCyan = context.createImageData(width, height);
        const finalImageData = context.createImageData(width, height);

        let r = 0;
        let strength = 0;
        let dn = 1;
        for (let y = 1; y < height; y += 1) {
            if (y % random.rangeFloor(2, 20) === 0) {
                r = random.value();
                strength = y > height - 30 ? 20 : random.rangeFloor(2, 10);
                dn = random.rangeFloor(1, 5);
            }
            const rX = r > (y > height - 50 ? 0.1 : 0.8) ? Math.cos((y + time) / dn) * strength : 0;
            for (let x = 0; x < width; x += 1) {
                const iy = ~~(camImageData.height * y / height);
                const ix = ~~(camImageData.width * x / width);

                const pixelIdx = camImageData.width * 4 * iy + 4 * ix;

                const r = camImageData.data[pixelIdx];
                const g = camImageData.data[pixelIdx + 1];
                const b = camImageData.data[pixelIdx + 2];

                const l = ~~(getLuminance(r, g, b) * 255);

                const mColor = ~~((r + g + b) / 3);
                const bP = Math.cos(time * dn) + 2;
                setPixel(imgDataBack, [x + rX, y], [r + random.range(-50, 50), mColor, b + random.range(-20, 20)]);
                setPixel(
                    imgDataRed,
                    [
                        x + bP, //
                        y, //
                    ],
                    [l, 0, 0]
                );
                setPixel(
                    imgDataCyan,
                    [
                        x - bP, //
                        y, //
                    ],
                    [0, l, l]
                );
            }
        }

        for (let y = 1; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                const pixelIdx = width * 4 * y + 4 * x;

                const r = imgDataBack.data[pixelIdx] * imgDataRed.data[pixelIdx] / 255;
                const g = imgDataBack.data[pixelIdx + 1] * imgDataCyan.data[pixelIdx + 1] / 255;
                const b = imgDataBack.data[pixelIdx + 2] * imgDataCyan.data[pixelIdx + 2] / 255;

                setPixel(finalImageData, [x, y], [r * 4, g * 4, b * 4]);
            }
        }

        for (let y = 1; y < height; y += 1) {
            const show = y > random.gaussian(0, height / 5) + height;
            const sinFactor = Math.cos(y / 5 + time / 2) / 2 + 0.5;
            for (let x = 0; x < width; x += 1) {
                if (random.value() > 0.95 && show && sinFactor > random.value()) {
                    for (let i = 0; i < random.range(5, 20); i += 1) {
                        const lx = x + i;
                        const ly = y;

                        const pixelIdx = width * 4 * y + 4 * x;

                        const r = finalImageData.data[pixelIdx] + random.range(15, 50);
                        const g = finalImageData.data[pixelIdx + 1] + random.range(15, 50);
                        const b = finalImageData.data[pixelIdx + 2] + random.range(15, 50);

                        setPixel(finalImageData, [lx, ly], [r, g, b]);
                    }
                }
            }
        }

        context.putImageData(finalImageData, 0, 0);
    };
};

console.log(random.gaussian);

(async () => {
    cam = new WebCam();
    await cam.start();

    settings.dimensions[0] = cam.width;
    settings.dimensions[1] = cam.height;

    canvasSketch(sketch, settings);
})();

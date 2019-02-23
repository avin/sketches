import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';

const settings = {
    dimensions: [600, 600],
    animate: true,
    duration: 3,
};

const sketch = () => {
    const fillStyle = 'hsl(0, 0%, 98%)';

    const checkCirclesCollision = (circle1, circle2) => {
        const { x: x1, y: y1, radius: radius1 } = circle1;
        const { x: x2, y: y2, radius: radius2 } = circle2;

        const distance = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);

        return distance <= radius1 + radius2;
    };

    // Generate circles
    const circles = [];
    const maxCircles = 150;
    const width = settings.dimensions[0];
    const height = settings.dimensions[1];
    const margin = width * 0.1;

    for (let i = 0; i < maxCircles; i += 1) {
        const maxCircleRadius = random.range(width * 0.1, width * 0.05);

        let ready = false;
        while (!ready) {
            const circle = {
                x: random.range(margin, width - margin),
                y: random.range(margin, height - margin),
                radius: 0.01 * width,
            };

            // First time check - does not in another circle
            let hasCollision = false;
            circles.forEach(aCircle => {
                hasCollision = hasCollision || checkCirclesCollision(circle, aCircle);
            });
            if (!hasCollision) {
                let subReady = false;
                while (!subReady) {
                    let hasCollision = false;

                    // Increase radius
                    circle.radius += width * 0.001;

                    // Check collision with new radius
                    circles.forEach(aCircle => {
                        hasCollision = hasCollision || checkCirclesCollision(circle, aCircle);
                    });

                    if (hasCollision || circle.radius > maxCircleRadius) {
                        // Revert radius
                        circle.radius -= width * 0.001;
                        circles.push(circle);
                        subReady = true;
                    }
                }

                ready = true;
            }
        }
    }

    return ({ context, width, height, playhead }) => {
        const suf = (Math.cos(playhead * Math.PI * 2) + 1) / 2;

        context.fillStyle = fillStyle;
        context.fillRect(0, 0, width, height);

        // Draw circles
        const lineWidth = margin / 64;
        circles.forEach(({ x, y, radius }, idx) => {
            context.beginPath();
            context.lineWidth = lineWidth;
            context.arc(x, y, radius, 0, Math.PI * 2, false);
            context.stroke();

            for (let i = 0; i < 1; i += 0.3) {
                context.beginPath();
                context.strokeStyle = `hsl(0,100%,${i * 10}%)`;
                context.lineWidth = lineWidth * i;
                context.arc(x, y, Math.max(0, radius * suf * i - idx / i / 5), 0, Math.PI * 2, false);
                context.stroke();
            }
        });
    };
};

canvasSketch(sketch, settings);

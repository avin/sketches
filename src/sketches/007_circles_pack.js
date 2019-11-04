import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';

const settings = {
    dimensions: [2048, 2048],
};

const sketch = () => {
    const fillStyle = 'hsl(0, 0%, 98%)';

    const checkCirclesCollision = (circle1, circle2) => {
        const { x: x1, y: y1, radius: radius1 } = circle1;
        const { x: x2, y: y2, radius: radius2 } = circle2;

        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

        return distance <= radius1 + radius2;
    };

    return ({ context, width, height }) => {
        context.fillStyle = fillStyle;
        context.fillRect(0, 0, width, height);

        const maxCircles = 150;
        const margin = width * 0.1;

        const circles = [];

        // debugger;
        // Generate circles
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

        // Draw circles
        const lineWidth = margin / 64;
        circles.forEach(({ x, y, radius }) => {
            context.beginPath();
            context.lineWidth = lineWidth;
            context.arc(x, y, radius, 0, Math.PI * 2, false);
            context.stroke();

            for (let i = 0; i < 1; i += 0.3) {
                context.beginPath();
                context.strokeStyle = `hsl(0,100%,${i * 10}%)`;
                context.lineWidth = lineWidth * i;
                context.arc(x, y, radius * i, 0, Math.PI * 2, false);
                context.stroke();
            }
        });
    };
};

canvasSketch(sketch, settings);

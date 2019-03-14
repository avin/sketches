import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import Stats from 'stats.js';
import { Engine, World, Bodies } from 'matter-js';
import { setDrawPolygon } from './lib/ctx';
import Collection from './lib/collection';
import { pointsDistance } from './lib/geometry';

const settings = {
    dimensions: [600, 600],
    animate: true,
};

const sketch = async ({ width, height }) => {
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const colors = ['#fad089', '#ff9c5b', '#f5634a', '#ed303c'];

    const size = width;

    const maxBalls = 33;

    const engine = Engine.create();

    const side1 = Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true });
    const side2 = Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true });
    const side3 = Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true });
    const side4 = Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true });

    World.add(engine.world, [side1, side2, side3, side4]);

    // run the engine
    Engine.run(engine);

    const balls = new Collection();
    for (let i = 0; i < maxBalls; i += 1) {
        const r = random.rangeFloor(10, 30);
        const ball = {
            x: random.range(r + 5, size - r - 5),
            y: random.range(r + 5, size - r - 5),
            r,
            color: random.pick(colors),
        };

        ball.body = Bodies.rectangle(ball.x, ball.y, ball.r, ball.r, {
            frictionAir: 0,
        });

        World.add(engine.world, ball.body);

        balls.add(ball);
    }

    const maxDistance = size / 4;

    return ({ context, width, height, time }) => {
        stats.begin();

        engine.world.gravity.x = Math.cos(time * 2) * 0.1;
        engine.world.gravity.y = Math.sin(time * 2) * 0.1;

        context.fillStyle = 'hsla(0, 0%, 98%, 0.5)';
        context.fillRect(0, 0, width, height);

        context.strokeStyle = `hsla(0,0%,0%,0.5)`;

        for (let i = 0; i < balls.size; i += 1) {
            const ball = balls.items[i];



            for (let j = ~~(balls.size / 2); j < balls.size; j += 1) {
                const idx = (i + j) % balls.size;

                const aBodyPos = balls.items[idx].body.position;
                const bodyPos = ball.body.position;

                const distance = pointsDistance(aBodyPos.x, aBodyPos.y, bodyPos.x, bodyPos.y);

                if (distance < maxDistance) {
                    context.beginPath();
                    context.lineWidth = 0.5 * (distance / maxDistance);
                    context.moveTo(bodyPos.x, bodyPos.y);
                    context.lineTo(aBodyPos.x, aBodyPos.y);
                    context.stroke();
                }
            }
        }

        for (let i = 0; i < balls.size; i += 1) {
            const ball = balls.items[i];

            const ballCoords = ball.body.vertices.map(i => [i.x, i.y]);
            setDrawPolygon(context, ballCoords, true);
            context.fillStyle = ball.color;
            context.fill();


        }

        Engine.update(engine, 1000 / 60);

        stats.end();
    };
};

canvasSketch(sketch, settings);

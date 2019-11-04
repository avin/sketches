import _ from 'lodash';
import * as BABYLON from 'babylonjs';

export default class {
    constructor(renderer, fromTo, mainBalls) {
        this.renderer = renderer;

        this.from = fromTo[0];
        this.to = fromTo[1];

        this.mainBalls = mainBalls;
        this.balls = [];
        this.randomBalls = [];

        this.init();
    }

    init() {
        let x = this.from;
        const index = 0;
        let mesh;
        let ball;
        let scaleSize;
        let randomRemotenessZ;
        let randomRemotenessY;
        while (x <= this.to) {
            mesh = _.sample(this.mainBalls);
            ball = mesh.createInstance(`ball_${index}`);
            ball.position.x = x;
            scaleSize = (3 + _.random(3)) / 10;

            ball.scaling = new BABYLON.Vector3(scaleSize, scaleSize, scaleSize);
            this.balls.push(ball);
            x += scaleSize;

            // Add random small balls
            if (_.random(100) > 0) {
                randomRemotenessZ = (-5 + _.random(10)) / 7;
                randomRemotenessY = (-5 + _.random(10)) / 7;
                scaleSize = (3 + _.random(3)) / 10;

                mesh = _.sample(this.mainBalls);
                ball = mesh.createInstance(`ball${index}`);
                ball.position.x = x + (-1 + _.random(2)) / 10;
                ball.position.z = randomRemotenessZ;
                ball.position.y = randomRemotenessY;

                ball.scaling = new BABYLON.Vector3(scaleSize, scaleSize, scaleSize);
                this.randomBalls.push(ball);

                ball.speed = _.random(1, 10) / 10;
                ball.realY = ball.position.y;
                ball.realZ = ball.position.z;
            }
        }
    }

    update(delta, time) {
        _.each(this.randomBalls, randomBall => {
            randomBall.position.y = Math.cos(time * (randomBall.speed + 0.5) * 5) * randomBall.realY;
            randomBall.position.z = Math.sin(time * (randomBall.speed + 0.5) * 5) * randomBall.realZ;
        });
    }
}

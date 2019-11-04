import _ from 'lodash';
import * as BABYLON from 'babylonjs';

export default class {
    constructor(renderer, coordinate, sourceBall) {
        this.renderer = renderer;
        this.coordinate = coordinate;

        this.mainBall = sourceBall;

        this.balls = [];

        this.init();
    }

    init() {
        for (let i = 0; i < 10; i += 1) {
            const ball = this.mainBall.createInstance(`ball_${i}`);
            ball.position = new BABYLON.Vector3(this.coordinate.x, this.coordinate.y, this.coordinate.z);

            const p = BABYLON.Matrix.Translation((_.random(4) - 2) / 5, (_.random(4) - 2) / 5, (_.random(4) - 2) / 5);
            ball.setPivotMatrix(p);

            const scaleSize = (_.random(3) + 5) / 5;
            ball.scaling = new BABYLON.Vector3(scaleSize, scaleSize, scaleSize);
            ball.randomnes = (_.random(10) + 5) / 10;
            ball.speed = _.random(5) + 5;
            this.balls.push(ball);
        }
    }

    update(delta, time) {
        _.each(this.balls, ball => {
            ball.rotation.x = (time * ball.speed) / 5;
            ball.rotation.y = (time * ball.speed) / 5;
            ball.rotation.z = (time * ball.speed) / 5;
        });
    }
}

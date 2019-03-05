import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import Collection from './lib/collection';

const browserSetup = canvas => {
    canvas.addEventListener('click', () => {
        canvas.requestPointerLock =
            canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;

        canvas.requestPointerLock();
    });
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, type, x, volume = 1) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g);
    o.type = type;
    g.connect(audioCtx.destination);
    o.frequency.value = frequency;
    o.start();
    g.gain.value = volume;
    g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + x);

    setTimeout(() => {
        o.stop();
        o.disconnect();
    }, 500);
}



// ======================================
// ============= Bullet =================
// ======================================

class Bullet {
    constructor(options) {
        for (const [key, option] of Object.entries(options)) {
            this[key] = option;
        }

        this.color = random.pick(['#4b86b4', '#adcbe3', '#63ace5']);
        this.size = this.baseOptions.fieldSize / 100;
        this.speed = this.baseOptions.fieldSize / 100 * this.initSpeedFactor;
    }

    update() {
        const { moveAngle, game: { enemies } } = this;

        this.bX = this.x;
        this.bY = this.y;

        this.speed += -0.1;

        if (this.speed <= 0) {
            this.draw(true);
            this.destroy();
        } else {
            this.x += Math.cos(moveAngle) * this.speed;
            this.y += Math.sin(moveAngle) * this.speed;
        }

        if (
            this.x < -100 ||
            this.x > this.baseOptions.width + 100 ||
            this.y < -100 ||
            this.y > this.baseOptions.height + 100
        ) {
            this.destroy();
        }

        enemies.items.forEach(enemy => {
            if (enemy.live) {
                const distance = Math.sqrt((this.x - enemy.x) ** 2 + (this.y - enemy.y) ** 2);
                if (distance < enemy.size) {
                    enemy.explode();
                    this.destroy();
                }
            }
        });
    }

    draw(onBackground = false) {
        const { baseOptions: { context, backgroundContext }, x, y } = this;

        let ctx;
        if (onBackground) {
            ctx = backgroundContext;
        } else {
            ctx = context;
        }

        ctx.lineWidth = this.size / 10;

        // Tail
        const tailLength = Math.min(this.size * Math.max(this.speed, 1), this.size * 5);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + Math.cos(this.moveAngle - Math.PI) * tailLength,
            this.y + Math.sin(this.moveAngle - Math.PI) * tailLength
        );
        ctx.stroke();

        // Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    destroy() {
        this.game.bullets.remove(this);
    }
}

// ======================================
// ============= Enemy =================
// ======================================

class Enemy {
    constructor(options) {
        for (const [key, option] of Object.entries(options)) {
            this[key] = option;
        }

        this.live = true;
        this.sizeFactor = random.range(20, 30);
        this.size = this.baseOptions.fieldSize * (1 / this.sizeFactor);
        this.particleSize = this.baseOptions.fieldSize / 100;
        this.speed = this.baseOptions.fieldSize / (this.sizeFactor * 10);

        this.moveAngle = Math.PI / 2;
    }

    update() {
        const { game: { ship } } = this;

        if (this.live) {
            this.moveAngle = Math.atan2(ship.y - this.y, ship.x - this.x);

            this.x += Math.cos(this.moveAngle) * this.speed;
            this.y += Math.sin(this.moveAngle) * this.speed;

            const distanceToShip = Math.sqrt((this.x - ship.x) ** 2 + (this.y - ship.y) ** 2);
            if (distanceToShip < this.size / 2 + ship.size / 2) {
                ship.explode();
                this.destroy();
            }
        } else {
            let maxSpeed = 0;
            this.particles.forEach(p => {
                p.x += Math.cos(p.a) * p.speed;
                p.y += Math.sin(p.a) * p.speed;
                p.speed = Math.max(p.speed - (1 - 1 / p.speed), 1);

                maxSpeed = Math.max(maxSpeed, p.speed);

                return p;
            });
            if (maxSpeed <= 1) {
                this.draw(true);
                this.destroy();
            }
        }
    }

    draw(onBackground = false) {
        const { baseOptions: { context, backgroundContext }, x, y } = this;

        let ctx;
        if (onBackground) {
            ctx = backgroundContext;
        } else {
            ctx = context;
        }

        if (this.live) {
            // Body
            ctx.fillStyle = '#ff6f69';
            ctx.lineWidth = this.size / 30;
            ctx.beginPath();
            ctx.arc(x, y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Track
            backgroundContext.fillStyle = 'hsla(0,0%,98%,0.1)';
            backgroundContext.beginPath();
            backgroundContext.arc(x, y, this.size / 2, 0, Math.PI * 2);
            backgroundContext.fill();
        } else {
            this.particles.forEach(({ x, y, size, c }) => {
                ctx.fillStyle = c;
                ctx.beginPath();
                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    explode() {
        playSound(random.pick([349.2 + 100, 392.0 + 100, 440.0 + 100]), 'sine', 0.12);

        this.live = false;
        this.particles = [];
        for (let i = 0; i < this.sizeFactor * 2; i += 1) {
            const particle = {
                x: this.x + random.range(-this.size, this.size),
                y: this.y + random.range(-this.size, this.size),
                speed: random.range(5, 10),
                size: this.particleSize * random.range(0.5, 1.5),
                c: `hsl(0, 100%,${random.range(40, 60)}%)`,
            };

            particle.a = Math.atan2(particle.y - this.y, particle.x - this.x);

            this.particles.push(particle);
        }
    }

    destroy() {
        this.game.enemies.remove(this);
    }
}

// ======================================
// ============= Ship ===================
// ======================================

class Ship {
    constructor(options) {
        for (const [key, option] of Object.entries(options)) {
            this[key] = option;
        }

        this.deadTime = 0;

        this.size = this.baseOptions.fieldSize / 50;

        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.baseOptions.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.baseOptions.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));

        this.cursorX = 0;
        this.cursorY = 0;

        this.moveDirection = {
            up: false,
            right: false,
            down: false,
            left: false,
        };
        this.gunAngle = Math.PI;
    }

    fire() {
        if (!this.game.running) {
            this.game.ship.deadTime = this.game.time;
            this.game.running = true;
            playSound(random.pick([100]), 'sine', 1, 0.5);
            return;
        }

        if (this.dead) {
            return;
        }

        const { baseOptions, game } = this;
        // playSound(random.pick([698.5, 784.0, 880.0]), 'sawtooth', 0.08);
        playSound(random.pick([311.1, 370.0, 415.3]), 'sawtooth', 0.1, 0.5);
        playSound(random.pick([155.6, 185.0, 207.7]), 'sine', 0.2, 0.5);

        for (let i = 0; i < 8; i += 1) {
            const bullet = new Bullet({
                baseOptions,
                game,
                x: this.gunTipCoord[0],
                y: this.gunTipCoord[1],
                moveAngle: this.gunAngle + random.range(-Math.PI / 32, Math.PI / 32),
                initSpeedFactor: random.range(0.8, 1.2),
            });
            game.bullets.add(bullet);
        }
    }

    explode() {
        playSound(87.31, 'triangle', 0.1);

        const { x, y, baseOptions, game } = this;
        this.dead = true;
        this.deadTime = game.time;

        for (let a = -Math.PI; a < Math.PI; a += Math.PI / 50) {
            const bullet = new Bullet({
                baseOptions,
                game,
                x,
                y,
                moveAngle: a,
                initSpeedFactor: random.range(0.8, 1.2),
            });
            game.bullets.add(bullet);
        }
    }

    handleMouseDown(e) {
        this.fire();
    }

    handleMouseMove(e) {
        const { movementX, movementY } = e;

        this.cursorX += movementX;
        this.cursorY += movementY;

        this.gunAngle = Math.atan2(this.cursorY, this.cursorX);

        this.cursorX = 200 * Math.cos(this.gunAngle);
        this.cursorY = 200 * Math.sin(this.gunAngle);
    }

    handleKeyPress(e) {
        switch (e.code) {
            case 'ArrowUp':
            case 'KeyW': {
                this.moveDirection.up = true;
                break;
            }
            case 'ArrowRight':
            case 'KeyD': {
                this.moveDirection.right = true;
                break;
            }
            case 'ArrowDown':
            case 'KeyS': {
                this.moveDirection.down = true;
                break;
            }
            case 'ArrowLeft':
            case 'KeyA': {
                this.moveDirection.left = true;
                break;
            }
            default:
        }
    }

    handleKeyUp(e) {
        switch (e.code) {
            case 'ArrowUp':
            case 'KeyW': {
                this.moveDirection.up = false;
                break;
            }
            case 'ArrowRight':
            case 'KeyD': {
                this.moveDirection.right = false;
                break;
            }
            case 'ArrowDown':
            case 'KeyS': {
                this.moveDirection.down = false;
                break;
            }
            case 'ArrowLeft':
            case 'KeyA': {
                this.moveDirection.left = false;
                break;
            }
            default:
        }
    }

    update() {
        if (this.dead) {
            if (this.game.time - this.deadTime > 1) {
                this.dead = false;
            }
            return;
        }
        const moveDiff = this.baseOptions.fieldSize / 300;
        if (this.moveDirection.up) {
            this.y += -moveDiff;
        }
        if (this.moveDirection.right) {
            this.x += moveDiff;
        }
        if (this.moveDirection.down) {
            this.y += moveDiff;
        }
        if (this.moveDirection.left) {
            this.x -= moveDiff;
        }

        this.x = Math.max(Math.min(this.baseOptions.width, this.x), 0);
        this.y = Math.max(Math.min(this.baseOptions.height, this.y), 0);
    }

    draw() {
        const { baseOptions: { context }, x, y, gunAngle } = this;

        if (this.dead) {
            return;
        }

        // Body
        context.fillStyle = `#96ceb4`;
        context.lineWidth = this.size / 10;
        context.beginPath();
        context.arc(x, y, this.size / 2, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        // Gun
        context.beginPath();
        const fromX = Math.cos(gunAngle) * this.size / 2;
        const fromY = Math.sin(gunAngle) * this.size / 2;

        const toX = Math.cos(gunAngle) * this.size * 1.5;
        const toY = Math.sin(gunAngle) * this.size * 1.5;

        this.gunTipCoord = [x + toX, y + toY];

        context.moveTo(x + fromX, y + fromY);
        context.lineTo(x + toX, y + toY);
        context.stroke();
    }
}

// ====================================
// ============== MAIN ================
// ====================================

const settings = {
    dimensions: [1201, 1201],
    animate: true,
};

const sketch = async ({ canvas, context, width, height }) => {
    browserSetup(canvas);

    const backGroundCanvas = document.createElement('canvas');
    backGroundCanvas.width = width;
    backGroundCanvas.height = height;
    const backgroundContext = backGroundCanvas.getContext('2d');
    backgroundContext.fillStyle = 'hsl(0, 0%, 98%)';
    backgroundContext.fillRect(0, 0, width, height);

    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = width;
    gridCanvas.height = height;
    const gridContext = gridCanvas.getContext('2d');

    gridContext.lineWidth = 0.05;
    gridContext.strokeStyle = 'hsla(0, 0%, 50%)';
    for (let y = 0.5; y < height; y += 50) {
        gridContext.beginPath();
        gridContext.moveTo(0, y);
        gridContext.lineTo(width, y);
        gridContext.stroke();
    }
    for (let x = 0.5; x < width; x += 50) {
        gridContext.beginPath();
        gridContext.moveTo(x, 0);
        gridContext.lineTo(x, height);
        gridContext.stroke();
    }

    const fieldSize = Math.min(width, height);

    const game = {
        running: false,
    };

    const baseOptions = {
        context,
        canvas,
        fieldSize,
        width,
        height,
        backgroundContext,
        backGroundCanvas,
    };

    game.bullets = new Collection();
    game.enemies = new Collection();

    game.ship = new Ship({
        baseOptions,
        game,
        x: width / 2,
        y: height / 2,
    });

    const createEnemy = () => {
        const pos = random.pick(['top', 'left', 'bottom', 'right']);
        let x = 0;
        let y = 0;
        const offset = 100;
        switch (pos) {
            case 'top': {
                y = -offset;
                x = random.range(0 - offset, width + offset);
                break;
            }
            case 'right': {
                x = width + offset;
                y = random.range(0 - offset, width + offset);
                break;
            }
            case 'bottom': {
                y = height + offset;
                x = random.range(0 - offset, width + offset);
                break;
            }
            case 'left': {
                x = -offset;
                y = random.range(0 - offset, width + offset);
                break;
            }
        }
        game.enemies.add(new Enemy({ baseOptions, game, x, y }));
    };

    return ({ context, time }) => {
        game.time = time;

        backgroundContext.drawImage(gridCanvas, 0, 0);
        backgroundContext.fillStyle = `hsla(0, 0%, 98%, 0.01)`;
        backgroundContext.fillRect(0, 0, width, height);
        context.drawImage(backGroundCanvas, 0, 0);

        if (game.running) {
            if (game.enemies.size < Math.min(Math.floor((time - game.ship.deadTime) / 3) + 1, 15)) {
                createEnemy();
            }

            game.enemies.items.forEach(enemy => {
                enemy.update();
                enemy.draw();
            });

            game.bullets.items.forEach(bullet => {
                bullet.update();
                bullet.draw();
            });

            game.ship.update();
            game.ship.draw();
        } else {
            context.save();
            context.translate(width / 2, height / 2);
            context.rotate(Math.cos(time * 5) / 5);
            context.font = 'bold 90px Arial';
            context.textAlign = 'center';
            context.fillStyle = 'hsl(0, 0%, 20%)';
            context.fillText('Click to start', 0, 0);
            context.restore();
        }
    };
};

canvasSketch(sketch, settings);

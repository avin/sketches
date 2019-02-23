/*
 * Made using this tutor https://www.sitepoint.com/building-3d-engine-javascript/
 */

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
    dimensions: [1024, 1024],
    animate: true,
};

const sketch = () => {
    const Vertex = function(x, y, z) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.z = parseFloat(z);
    };

    const Vertex2D = function(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    };

    const Cube = function(center, side) {
        // Generate the vertices
        const d = side / 2;

        this.vertices = [
            new Vertex(center.x - d, center.y - d, center.z + d),
            new Vertex(center.x - d, center.y - d, center.z - d),
            new Vertex(center.x + d, center.y - d, center.z - d),
            new Vertex(center.x + d, center.y - d, center.z + d),
            new Vertex(center.x + d, center.y + d, center.z + d),
            new Vertex(center.x + d, center.y + d, center.z - d),
            new Vertex(center.x - d, center.y + d, center.z - d),
            new Vertex(center.x - d, center.y + d, center.z + d),
        ];

        // Generate the faces
        this.faces = [
            [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
            [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
            [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
            [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
            [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
            [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]],
        ];
    };

    function projectOrtho(M) {
        return new Vertex2D(M.x, M.z);
    }

    // eslint-disable-next-line no-unused-vars
    function projectPersp(M) {
        // Distance between the camera and the plane
        const d = 100;
        const r = d / M.y;

        return new Vertex2D(r * M.x, r * M.z);
    }

    function render(obj, ctx, dx, dy) {
        for (let j = 0; j < obj.faces.length; j += 1) {
            // Current face
            const face = obj.faces[j];

            // Draw the other vertices
            for (let k = 0; k < face.length; k += 1) {
                const P = projectOrtho(face[k]);
                if (k === 0) {
                    ctx.beginPath();
                    ctx.moveTo(P.x + dx, -P.y + dy);
                } else {
                    ctx.lineTo(P.x + dx, -P.y + dy);
                }
            }

            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }

    let firstTime = true;
    const cubeObjects = [];

    return ({ context, width, height, time }) => {
        context.lineJoin = 'round';
        context.lineWidth = width * 0.002;

        if (firstTime) {
            context.fillStyle = 'hsl(0,0%,98%)';
            context.fillRect(0, 0, width, height);

            // Create the cube
            for (let x = width / 5; x < width; x += width / 5) {
                for (let y = height / 5; y < height; y += height / 5) {
                    const cubeCenter = new Vertex(0, (11 * 100) / 10, 0);
                    const cube = new Cube(cubeCenter, 100);
                    cubeObjects.push({
                        obj: cube,
                        cubeCenter,
                        x,
                        y,
                        rand: random.value(),
                    });
                }
            }

            firstTime = false;
        }

        context.fillStyle = `hsla(0,0%,95%,${Math.cos(time / 2) / 10})`;
        context.fillRect(0, 0, width, height);

        // Rotate a vertice
        function rotate(M, center, theta, phi, rand) {
            theta *= Math.cos(time * rand);
            // Rotation matrix coefficients
            const ct = Math.cos(theta);
            const st = Math.sin(theta);
            const cp = Math.cos(phi);
            const sp = Math.sin(phi);

            // Rotation
            const x = M.x - center.x;
            const y = M.y - center.y;
            const z = M.z - center.z;

            M.x = ct * x - st * cp * y + st * sp * z + center.x;
            M.y = st * x + ct * cp * y - ct * sp * z + center.y;
            M.z = sp * y + cp * z + center.z;
        }

        cubeObjects.forEach(({ obj, cubeCenter, rand }) => {
            obj.vertices.forEach(vertix => {
                rotate(vertix, cubeCenter, -Math.PI / 720, Math.PI / 720, rand);
            });
        });

        cubeObjects.forEach(({ obj, x, y, rand }) => {
            context.strokeStyle = `hsla(${Math.cos(time + rand * 100) * 180 + 180},80%, 50%, 0.5)`;
            context.fillStyle = `hsla(${Math.cos(time + (rand / 2) * 100) * 180 + 180},80%, 50%, 0.01)`;

            render(obj, context, x, y);
        });
    };
};

canvasSketch(sketch, settings);

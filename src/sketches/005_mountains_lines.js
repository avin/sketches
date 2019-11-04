import canvasSketch from 'canvas-sketch';

const settings = {
    dimensions: [2048, 2048],
};

const sketch = () => {
    const fillStyle = 'hsl(0, 0%, 98%)';

    return ({ context, width, height }) => {
        context.fillStyle = fillStyle;
        context.fillRect(0, 0, width, height);

        const step = height * 0.02;
        const lines = [];

        for (let i = step * 5; i <= width - step; i += step) {
            const line = [];
            for (let j = step; j <= width - step; j += step) {
                const distanceToCenter = Math.abs(j - width / 2);
                const variance = Math.max(width / 2 - width * 0.12 - distanceToCenter, 0);
                const random = ((Math.random() * variance) / 2) * -1;
                const point = { x: j, y: i + random };
                line.push(point);
            }
            lines.push(line);
        }

        for (let i = 5; i < lines.length; i += 1) {
            let j = 0;
            context.beginPath();
            context.strokeStyle = `hsl(0, 0%, ${50 - (50 * i) / lines.length}%)`;
            context.moveTo(lines[i][0].x, lines[i][0].y);

            for (j = 0; j < lines[i].length - 2; j += 1) {
                const xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
                const yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
                context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
            }

            context.lineWidth = Math.max(height * 0.001 * (i / 10), height * 0.001);
            context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y);
            context.fillStyle = fillStyle;
            context.fill();
            context.stroke();
        }
    };
};

canvasSketch(sketch, settings);

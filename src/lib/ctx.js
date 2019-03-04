export const drawLine = (context, lineCoords) => {
    context.beginPath();
    for (let i = 0; i < lineCoords.length; i += 1) {
        const p = lineCoords[i];
        if (i === 0) {
            context.moveTo(p[0], p[1]);
        } else {
            context.lineTo(p[0], p[1]);
        }
    }
    context.stroke();
};

export function setDrawPolygon(context, lineCoords, closePath = false) {
    context.beginPath();
    for (let i = 0; i < lineCoords.length; i += 1) {
        const p = lineCoords[i];
        if (i === 0) {
            context.moveTo(p[0], p[1]);
        } else {
            context.lineTo(p[0], p[1]);
        }
    }
    if (closePath) {
        context.closePath();
    }
}

export const drawLine = (context, lineCoords, closePath = false) => {
    setDrawPolygon(context, lineCoords, closePath);
    context.stroke();
};

export function setPixel(imgData, coord, color) {
    const n = (~~coord[0] + ~~coord[1] * imgData.width) * 4;
    imgData.data[n] = color[0];
    imgData.data[n + 1] = color[1];
    imgData.data[n + 2] = color[2];
    imgData.data[n + 3] = color[3] === undefined ? 255 : color[3];
}

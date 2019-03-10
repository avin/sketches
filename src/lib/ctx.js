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

export function setPixel(imgData, x, y, cR, cG, cB, cA = 255) {
    const n = (~~x + ~~y * imgData.width) * 4;

    imgData.data[n] = ~~cR;
    imgData.data[n + 1] = ~~cG;
    imgData.data[n + 2] = ~~cB;
    imgData.data[n + 3] = ~~cA;
}

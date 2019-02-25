/**
 * Get vectors intersection
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * @returns {number[]}
 */
export function findIntersection(p1, p2, p3, p4) {
    const x =
        ((p1[0] * p2[1] - p2[0] * p1[1]) * (p3[0] - p4[0]) - (p1[0] - p2[0]) * (p3[0] * p4[1] - p3[1] * p4[0])) /
        ((p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]));
    const y =
        ((p1[0] * p2[1] - p2[0] * p1[1]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] * p4[1] - p3[1] * p4[0])) /
        ((p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]));
    return [x, y];
}

/**
 * Is point on line
 * @param p
 * @param a
 * @param b
 * @returns {boolean}
 */
function isPointBetween(p, a, b) {
    return (
        ((a[0] <= p[0] && p[0] <= b[0]) || (a[0] >= p[0] && p[0] >= b[0])) &&
        ((a[1] <= p[1] && p[1] <= b[1]) || (a[1] >= p[1] && p[1] >= b[1]))
    );
}

/**
 * Get segments intersection
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * @returns {*}
 */
export function findSegmentIntersection(p1, p2, p3, p4) {
    const i1 = findIntersection(p1, p2, p3, p4);

    const isIntersected = isPointBetween(i1, p1, p2) && isPointBetween(i1, p3, p4);
    return isIntersected ? i1 : false;
}

/**
 * Get two points distance
 * @param p1
 * @param p2
 * @returns {number}
 */
export function pointsDistance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

/**
 * Length of segment
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number}
 */
export function lineLength([x1, y1], [x2, y2]) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

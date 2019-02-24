export function findIntersection(array) {
    const P1 = array[0],
        P2 = array[1],
        P3 = array[2],
        P4 = array[3];

    const x =
        ((P1[0] * P2[1] - P2[0] * P1[1]) * (P3[0] - P4[0]) - (P1[0] - P2[0]) * (P3[0] * P4[1] - P3[1] * P4[0])) /
        ((P1[0] - P2[0]) * (P3[1] - P4[1]) - (P1[1] - P2[1]) * (P3[0] - P4[0]));
    const y =
        ((P1[0] * P2[1] - P2[0] * P1[1]) * (P3[1] - P4[1]) - (P1[1] - P2[1]) * (P3[0] * P4[1] - P3[1] * P4[0])) /
        ((P1[0] - P2[0]) * (P3[1] - P4[1]) - (P1[1] - P2[1]) * (P3[0] - P4[0]));
    return [x, y];
}

function isPointBetween(p, a, b) {
    return (
        ((a[0] <= p[0] && p[0] <= b[0]) || (a[0] >= p[0] && p[0] >= b[0])) &&
        ((a[1] <= p[1] && p[1] <= b[1]) || (a[1] >= p[1] && p[1] >= b[1]))
    );
}

export function findSegmentIntersection(points) {
    const i1 = findIntersection(points);
    const P1 = points[0],
        P2 = points[1],
        P3 = points[2],
        P4 = points[3];
    const isIntersected = isPointBetween(i1, P1, P2) && isPointBetween(i1, P3, P4);
    return isIntersected ? i1 : false;
}

function isSegmentIntersected(points) {
    const i1 = findIntersection(points);
    const P1 = points[0],
        P2 = points[1],
        P3 = points[2],
        P4 = points[3];
    return isPointBetween(i1, P1, P2) && isPointBetween(i1, P3, P4);
}

export function pointsDistance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

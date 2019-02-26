/**
 * Get color luminance (0..1)
 * @param r
 * @param g
 * @param b
 * @returns {number}
 */
export function getLuminance(r, g, b) {
    return 0.2126 * r / 255 + 0.7152 * g / 255 + 0.0722 * b / 255;
}

/**
 * Get two color distance
 * Original https://en.wikipedia.org/wiki/Color_difference#Euclidean
 *
 * @param c1
 * @param c2
 * @returns {number}
 */
export function colorDistance(c1, c2) {
    const rbar = (c1[0] + c2[0]) / 2;
    const deltar = c1[0] - c2[0];
    const deltag = c1[1] - c2[1];
    const deltab = c1[2] - c2[2];
    return Math.sqrt(2 * deltar ** 2 + 4 * deltag ** 2 + 3 * deltab ** 2 + (rbar + (deltar ** 2 - deltab ** 2)) / 256);
}

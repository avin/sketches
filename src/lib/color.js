export function getLuminance(r, g, b) {
    return (0.2126 * r) / 255 + (0.7152 * g) / 255 + (0.0722 * b) / 255;
}

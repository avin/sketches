import { median } from 'd3-array';

export function compressArray(freqs, count) {
    let result = [];

    const chunkSize = Math.floor(freqs.length / count);

    for (let i = 0; i < count; i++) {
        let subResult = 0;

        for (let j = 0; j < chunkSize; j++) {
            subResult += freqs[i * chunkSize + j];
        }
        result.push(subResult/chunkSize);
    }

    return result;
}

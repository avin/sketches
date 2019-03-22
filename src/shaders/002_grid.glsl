precision highp float;

uniform vec2 u_resolution;

void main() {
    float cx = ceil(u_resolution.x / 2.0);
    float cy = ceil(u_resolution.y / 2.0);

    float x = gl_FragCoord.x - cx;
    float y = gl_FragCoord.y - cy;

    vec4 background = vec4(vec3(0.129, 0.168, 0.2), 1.0);

    // Lines + Bold lines
    background.xyz += step(1.0 - 1.0 / 10.0, fract(x / 10.0)) * 0.1 + step(1.0 - 1.0 / 50.0, fract(x / 50.0)) * 0.2;
    background.xyz += step(1.0 - 1.0 / 10.0, fract(y / 10.0)) * 0.1 + step(1.0 - 1.0 / 50.0, fract(y / 50.0)) * 0.2;

    // Center lines
    if (x > -1.5 && x < 1.5) {
        background.xyz = vec3(0.964, 0.447, 0.443);
    } else if (y > -1.5 && y < 1.5) {
        background.xyz = vec3(0.341, 0.8, 0.560);
    }

    // Center point
    if (x > -2.5 && x < 2.5 && y > -2.5 && y < 2.5) {
        background.xyz = vec3(1.0, 1.0, 1.0);
    }

    gl_FragColor = background;
}

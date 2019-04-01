// Based on https://www.youtube.com/watch?v=cQXAbndD5CQ

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

float Xor(float a, float b) {
    return a * (1.0 - b) + b*(1.0 - a);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    vec3 col = vec3(0);
    float t = u_time * 1.0;

    float a = 0.785; // PI/4
    float s = sin(a);
    float c = cos(a);
    uv *= mat2(c, - s, s, c);
    uv *= 20.0;

    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);

    float m = 0.0;

    for(float y =- 1.0; y <= 1.0; y ++ ) {
        for(float x =- 1.0; x <= 1.0; x ++ ) {
            vec2 offs = vec2(x, y);

            float d = length(gv - offs);
            float dist = length(id + offs) * 0.3;

            float r = mix(0.3, 1.5, sin(dist - t) * 0.5 + 0.5);
            m = Xor(m, smoothstep(r, r * 0.9, d));
        }
    }

    //col.rg = gv;
    col += m; //mod(m, 2.0);

    gl_FragColor = vec4(col, 1.0);
}

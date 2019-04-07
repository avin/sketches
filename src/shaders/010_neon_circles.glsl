precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv -= 0.5;
    uv.x *= u_resolution.x / u_resolution.y;

    vec2 gv = uv * 50.0 ;
    gv = fract(gv) - 0.5;

    float t = u_time * 5.0;

    float s = (sin(t - length(uv * 2.0) * 5.0) * 0.4 + 0.5) * 0.6;
    float m = smoothstep(s, s - 0.05, length(gv)) + s*2.0;

    vec3 col = vec3(s, 0.0, 0.5) * m;

    gl_FragColor = vec4(col, 1.0);
}

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    float smf =  u_resolution.x/u_resolution.y * 0.025;

    vec2 st = vec2(atan(uv.x, uv.y), length(uv));

    uv = vec2(st.x / 6.2831 + u_time * 2.0 - st.y * 20.0, st.y);

    float x = uv.x;
    float m = fract(x);

    float mask = smoothstep(0.25, 0.25 + smf, m);
    mask *= smoothstep(0.75, 0.75 - smf, m);

    vec3 col = vec3(0.88, 0, 0.52) * mask;

    gl_FragColor = vec4(col, 1.0);
}

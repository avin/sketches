// Impressed by https://www.youtube.com/watch?v=r1UOB8NVE8I

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {

    vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / u_resolution.y;

    vec2 st = vec2(atan(uv.x, uv.y), length(uv));

    float c1 = 0.0;
    float c2 = 0.0;
    float c3 = 0.0;
    float z = 1.0;
    for(float i = 0.0; i <= 3.14; i += 0.314) {
        z *= -1.0;
        uv = vec2(st.x / 6.2831 + i + (sign(z) * u_time * sqrt(i * 5.0) * 0.01), st.y + cos(u_time+i) * 0.02);

        float x = uv.x * 14.0;
        float m = min(fract(x), fract(1.0 - x));
        c1 += smoothstep(0.0, 0.01, m * 0.5 + 0.2 - uv.y*i*.75) * 0.20;
        c2 += sign(z) * smoothstep(0.0, 0.01, m * 0.5  - uv.y*i) * 0.75;
        c3 += sign(z * -1.0) * smoothstep(0.0, 0.01, m * 0.5 + 0.2 - uv.y) * 0.75;
    }

    vec3 col = vec3(fract(c3*.5), fract(c1 +c3), floor(c2 + c1)) ;

    gl_FragColor = vec4(col, 1.0);

}

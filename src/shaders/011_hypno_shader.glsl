precision highp float; 

uniform vec2 u_resolution; 
uniform float u_time; 

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv -= 0.5;
    uv.x *= u_resolution.x / u_resolution.y;
    
    vec2 st = vec2(atan(uv.x, uv.y), length(uv));
    
    uv = vec2(st.x / 6.2831 + u_time * 2.0 - st.y * 20.0, st.y);
    
    float x = uv.x;
    float m = fract(x);
    
    float mask = smoothstep(0.25, 0.275, m);
    mask *= smoothstep(0.75, 0.725, m);
    
    vec3 col = vec3(0.88, 0, 0.52) * mask;
    
    gl_FragColor = vec4(col, 1.0);
}

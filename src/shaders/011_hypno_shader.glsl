precision highp float; 

uniform vec2 u_resolution; 
uniform float u_time; 

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    
    vec2 st = vec2(atan(uv.x, uv.y), length(uv));
    
    uv = vec2(st.x / 6.2831 + u_time * 2.0 - st.y * 20.0, st.y);
    
    //float smf = 1.5 * fwidth(uv.x);
    float smf = 0.040;
    
    float m = fract(uv.x);
    
    float mask = smoothstep(0.0, smf, abs(m - 0.5) - 0.25);
    
    vec3 col = vec3(0.88, 0, 0.52) * mask;
    
    gl_FragColor = vec4(col, 1.0);
}

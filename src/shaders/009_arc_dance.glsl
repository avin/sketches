precision highp float; 

uniform vec2 u_resolution; 
uniform float u_time; 

void main() {
    
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    
    float factor = 50.0;
    
    // Rotation matrix
    float a = u_time * 2.0;
    float as = sin(a);
    float ac = cos(a);
    uv *= uv * mat2(ac, - as, as, ac);
    
    float v = fract(sin(uv.x * uv.y * factor) * 10.0);
    
    float mask = smoothstep(0.3, 0.0, abs(v - 0.5));
    
    vec3 col = vec3(uv.y * 1000.0, 0.7, uv.x * 1000.0) * mask;
    
    gl_FragColor = vec4(col, 1.0);
}

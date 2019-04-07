precision highp float; 

uniform vec2 u_resolution; 
uniform float u_time; 

void main() {
    
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv -= 0.5;
    uv.x *= u_resolution.x / u_resolution.y;
    
    float factor = 50.0;
    
    // Rotation matrix
    float a = u_time * 2.0;
    float as = sin(a);
    float ac = cos(a);
    uv *= uv * mat2(ac, - as, as, ac);
    
    float v = fract(sin(uv.x * uv.y * factor) * 10.0);
    
    float mask = smoothstep(0.2, 0.5, v);
    mask *= smoothstep(0.8, 0.5, v);
    
    vec3 col = vec3(uv.y * 1000.0, 0.7, uv.x * 1000.0) * clamp(mask, 0.0, 1.0);
    
    gl_FragColor = vec4(col, 1.0);
}

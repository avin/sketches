precision highp float; 
 
uniform vec2 u_resolution; 
uniform float u_time; 
 
#define S(a, b, t)smoothstep(a, b, t)
#define sat(x)clamp(x, 0.0, 1.0)
 
float remap01(float a, float b, float t) { 
    return sat((t - a) / (b - a));
} 
 
float remap(float a, float b, float c, float d, float t) { 
    return remap01(a, b, t) * (d - c) + c;
} 
 
void main() { 
    
    vec2 uv = gl_FragCoord.xy / u_resolution.xy - 0.5;
    uv.x *= u_resolution.x / u_resolution.y;
    
    vec3 col = vec3(0.5);
    
    float x = remap(-0.5, 0.5, 0.0, 100.0, uv.x);
    float y = remap(-0.5, 0.5, 0.0, 100.0, uv.y);
    
    float finalMask = 0.0;
    
    for(float nx = 1.0; nx < 10.0; nx += 1.0) {
        for(float ny = 1.0; ny < 10.0; ny += 1.0) {
            
            float size = 10.0;
            
            float px = nx * 10.0;
            float py = ny * 10.0;
            
            float mask = S(0.0 + px, 0.01 + px, x);
            mask *= S(size + px, size - 0.01 + px, x);
            mask *= S(0.0 + py, 0.0 + py, y);
            mask *= S(size + py, size - 0.01 + py, y);
            
            mask *= step(0.0, sin(u_time * (nx + ny)));
            
            finalMask += mask;
        }
    }
    
    col = mix(col, vec3(0.0, 1.0, 0.0), finalMask);
    
    gl_FragColor = vec4(col, 1.0);
} 

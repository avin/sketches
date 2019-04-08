// Inspired by https://www.youtube.com/watch?v=3CycKKJiwis   
precision highp float; 
 
uniform float u_time; 
uniform vec2 u_resolution; 
 
#define S(a, b, v)smoothstep(a, b, v)
 
float DistLine(vec2 p, vec2 a, vec2 b) { 
    vec2 pa = p-a;
    vec2 ba = b-a;
    float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * t);
} 
 
float N21(vec2 p) { 
    p = fract(p * vec2(233.34, 851.73));
    p += dot(p, p + 23.45);
    return fract(p.x * p.y);
} 
 
vec2 N22(vec2 p) { 
    float n = N21(p);
    return vec2(n, N21(p + n));
} 
 
vec2 GetPos(vec2 id, vec2 offs) { 
    vec2 n = N22(id + offs) * u_time;
    return offs + sin(n) * 0.4;
} 
 
float Line(vec2 p, vec2 a, vec2 b) { 
    float d = DistLine(p, a, b);
    float m = S(0.02, 0.00, d);
    m *= S(1.2, 0.8, length(a - b));
    return m;
} 
 
void main() { 
    
    vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / u_resolution.y;
    
    uv *= 20.0;
    
    vec2 guv = fract(uv) - 0.5;
    vec2 id = floor(uv);
    
    vec3 col = vec3(1.0);
    if (guv.x > 0.45 || guv.y > 0.45) {
        col = vec3(1.0);
    }
    
    vec2 p[9];
    int i = 0;
    for(float y =- 1.0; y <= 1.0; y ++ ) {
        for(float x =- 1.0; x <= 1.0; x ++ ) {
            
            for(int n = 0; n < 9; n ++ ) {
                if (n == i) {
                    p[n] = GetPos(id, vec2(x, y));
                    break;
                }
            }
            i ++ ;
            
        }
    }
    float m = 0.0;
    for(int i = 0; i < 9; i ++ ) {
        m += Line(guv, p[4], p[i]);
        
        vec2 j = (p[i] - guv) * 50.0;
        float sp = 1.0 / length(j);
        
        m += sp;
    }
    m += Line(guv, p[1], p[3]);
    m += Line(guv, p[1], p[5]);
    m += Line(guv, p[7], p[3]);
    m += Line(guv, p[7], p[5]);
    
    col = vec3(1.0, m, 1.0) * m;
    
    gl_FragColor = vec4(col, 1.0);
    
}
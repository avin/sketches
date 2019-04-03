precision highp float; 
 
uniform vec2 u_resolution; 
uniform float u_time; 
 
float DistLine(vec3 ro, vec3 rd, vec3 p) { 
    return length(cross(p - ro, rd)) / length(rd);
} 
 
float DrawPoint(vec3 ro, vec3 rd, vec3 p) { 
    float d = DistLine(ro, rd, p);
    d = smoothstep(0.06, 0.05, d);
    return d;
} 
 
void main() { 
    
    float t = u_time;
    
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv -= 0.5;
    uv.x *= u_resolution.x / u_resolution.y;
    
    vec3 ro = vec3(3.0 * sin(t), 2.0, - 3.0 * cos(t));
    
    float zoom = 1.0;
    
    vec3 lookat = vec3(0.5);
    vec3 f = normalize(lookat - ro);
    vec3 r = cross(vec3(0.0, 1.0, 0.0), f);
    vec3 u = cross(f, r);
    
    vec3 c = ro + f*zoom;
    vec3 i = c + uv.x * r + uv.y * u;
    vec3 rd = i-ro;
    
    float d = 0.0;
    
    d += DrawPoint(ro, rd, vec3(0.0, 0.0, 0.0));
    d += DrawPoint(ro, rd, vec3(0.0, 0.0, 1.0));
    d += DrawPoint(ro, rd, vec3(0.0, 1.0, 0.0));
    d += DrawPoint(ro, rd, vec3(0.0, 1.0, 1.0));
    d += DrawPoint(ro, rd, vec3(1.0, 0.0, 0.0));
    d += DrawPoint(ro, rd, vec3(1.0, 0.0, 1.0));
    d += DrawPoint(ro, rd, vec3(1.0, 1.0, 0.0));
    d += DrawPoint(ro, rd, vec3(1.0, 1.0, 1.0));
    
    gl_FragColor = vec4(d);
} 

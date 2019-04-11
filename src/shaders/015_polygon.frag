#ifdef GL_ES 
precision mediump float; 
#endif 
 
const float PI = 3.1415926535; 
 
uniform vec2 u_resolution; 
 
float Polygon(vec2 pos, float radius, float sides) { 
    float angle = atan(pos.x, pos.y);
    float slice = PI * 2.0 / sides;
    
    return step(radius, cos(floor(0.5 + angle / slice) * slice - angle) * length(pos));
} 
 
void main() { 
    
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.y;
    
    vec2 fuv = uv;
    fuv.x -= 0.25;
    fuv.y -= 0.25;
    float polygonMask = Polygon(fuv, 0.1, 3.0);
    
    fuv = uv;
    fuv.x += 0.25;
    fuv.y -= 0.25;
    polygonMask *= Polygon(fuv, 0.1, 4.0);
    
    fuv = uv;
    fuv.x -= 0.25;
    fuv.y += 0.25;
    polygonMask *= Polygon(fuv, 0.1, 5.0);
    
    fuv = uv;
    fuv.x += 0.25;
    fuv.y += 0.25;
    polygonMask *= Polygon(fuv, 0.1, 6.0);
    
    vec3 col = vec3(0.5) * polygonMask;
    gl_FragColor = vec4(col, 1.0);
    
}
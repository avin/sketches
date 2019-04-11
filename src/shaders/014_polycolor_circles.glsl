#extension GL_OES_standard_derivatives : enable 
 
precision lowp float; 
 
uniform vec2 u_resolution; 
uniform vec2 u_mouse; 
uniform float u_time; 
 
float rand(vec2 co) { 
    return fract(sin(dot(co.xy , vec2(12.9898, 78.233))) * 43758.5453);
} 
 
void main() { 
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.y;
    
    uv = uv * 10.0;
    uv.x += floor(mod(uv.y, 2.0)) * u_time * 2.0 - u_time;
    vec2 id = floor(uv);
    vec2 gv = fract(uv) - 0.5;
    
    float sF = 1.5 * fwidth(uv.x);
    
    float d = length(gv);
    
    float size = 0.4;
    float colMask = smoothstep(size, size - sF, d);
    
    vec3 circleColor = vec3(
        rand(id),
        rand(id + 1.0),
        rand(id + 2.0)
    );
    
    vec3 col = mix(vec3(1.0), circleColor, colMask);
    
    gl_FragColor = vec4(col, 1.0);
}
precision highp float; 

uniform vec2 u_resolution; 

void main()
 { 
    float cx = ceil(u_resolution.x / 2.0);
    float cy = ceil(u_resolution.y / 2.0);
    
    float x = gl_FragCoord.x - cx;
    float y = gl_FragCoord.y - cy;
    
    vec4 background = vec4(vec3(0.129, 0.168, 0.2), 1.0);
    
    // ======= Lines + Bold lines
    background.xyz += step(1.0 - 1.0 / 10.0, fract(x / 10.0)) * 0.1 + step(1.0 - 1.0 / 50.0, fract(x / 50.0)) * 0.2;
    background.xyz += step(1.0 - 1.0 / 10.0, fract(y / 10.0)) * 0.1 + step(1.0 - 1.0 / 50.0, fract(y / 50.0)) * 0.2;
    
    // ======= AXES
    float xb = step(0.0, abs(x) - 1.5);
    float yb = step(0.0, abs(y) - 1.5);
    
    // Remove color for axes first
    background.xyz *= xb * yb;
    // Make new color for axes
    background.xyz += ((1.0 - xb) * vec3(0.964, 0.447, 0.443));
    background.xyz += ((1.0 - yb) * vec3(0.341, 0.8, 0.560));
    
    // ======= CENTER
    float cb = (1.0 - step(0.0, abs(x) - 2.5)) * (1.0 - step(0.0, abs(y) - 2.5));
    
    // Remove color first
    background.xyz *= (1.0 - cb);
    // Fill new color
    background.xyz += cb * vec3(1.0, 1.0, 1.0);
    
    gl_FragColor = background;
}

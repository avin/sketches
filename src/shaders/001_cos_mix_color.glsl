 
#ifdef GL_ES 
precision mediump float; 
#endif 
 
uniform vec2 u_resolution; 
uniform vec2 u_mouse; 
uniform float u_time; 
 
#define PI_TWO 1.570796326794897 
#define PI 3.141592653589793 
#define TWO_PI 6.283185307179586 
 
vec2 coord(in vec2 p) { 
	p = p / u_resolution.xy;
	// correct aspect ratio
	if (u_resolution.x > u_resolution.y) {
		p.x *= u_resolution.x / u_resolution.y;
		p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
	}else {
		p.y *= u_resolution.y / u_resolution.x;
		p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
	}
	// centering
	//p -= 0.5;
	//p *= vec2(-1.0, 1.0);
	return p;
} 
#define rx 1.0 / min(u_resolution.x, u_resolution.y)
#define uv gl_FragCoord.xy / u_resolution.xy 
#define vUV coord(gl_FragCoord.xy)
#define mx coord(u_mouse)
 
float plot(vec2 st, float pec) { 
	
	return smoothstep(pec - 0.01, pec , st.y) - smoothstep(pec, pec + 0.01, st.x);
} 
 
void main() { 
	
	vec3 col1 = vec3(1.0, 0.0, 0.0);
	vec3 col2 = vec3(0.0, 0.0, 1.0);
	
	vec2 st = vUV;
	
	st = st / 2.0;
	
	vec3 pixel;
	if (vUV.y < cos(vUV.x * cos(u_time) * 5.0 + u_time * 5.0) / 4.0 + 0.5) {
		pixel = mix(col1, col2, cos(u_time * 1.0) / 2.0 + 0.5);
	} else {
		pixel = mix(col2, col1, cos(u_time * 1.0) / 2.0 + 0.5);
	}
	
	gl_FragColor = vec4(pixel, 1.0);
} 

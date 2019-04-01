// Based on https://www.youtube.com/watch?v=cQXAbndD5CQ

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

float Circle(vec2 uv, vec2 p, float r, float blur){
    float d = length(uv - p);
    return smoothstep(r, r-blur, d);
}

float Smiley(vec2 uv, vec2 pos, float size){
    float mask = Circle(uv, pos, size, 0.01);

    mask -= Circle(uv, vec2(-size*.3,size*.3), size*0.2, 0.01);
    mask -= Circle(uv, vec2(size*.3,size*.3), size*0.2, 0.01);

    float mouth = Circle(uv, pos, size*0.8, .01);
    mouth -= Circle(uv, vec2(pos.x, pos.y+ size*0.1), size*0.8, .01);
    mouth = clamp(mouth, 0.,1.);

    return (mask - mouth);
}

float Band(float v, float start, float end, float blur){
    float mask = smoothstep(start, start+blur, v);
    mask *= smoothstep(end, end-blur, v);

    return mask;
}

float Rect(vec2 uv, vec2 pos, vec2 size, float blur){
    float mask1 = Band(uv.x, pos.x, pos.x + size.x, blur);
    float mask2 = Band(uv.y, pos.y, pos.y + size.y, blur);

    return mask1 * mask2;
}

void main() {

    vec2 uv = gl_FragCoord.xy / u_resolution.xy - 0.5;
    uv.x *= u_resolution.x / u_resolution.y;

    // Rotation matrix
    float a = u_time*5.;
    float as = sin(a);
    float ac = cos(a);
    vec2 smileUv = uv * mat2(ac, - as, as, ac);

    float smileMask = Smiley(smileUv, vec2(0.), sin(u_time*3.)*0.1+0.3);
    vec3 c = vec3(1., 1., 0.) * smileMask;

    float rectMask  = Rect(uv, vec2(-0.4, 0.), vec2(0.2, 0.3), (sin(u_time*5.)*0.4+0.5)*0.05);
    c+= vec3(1., 0., 1.) * rectMask;

    gl_FragColor = vec4(vec3(c), 1.0);
}

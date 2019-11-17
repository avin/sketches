precision lowp float;

uniform mat3 uvTransform;

varying float fogDepth;
uniform float fogDensity;

void main() {
    vec2 uv = (uvTransform * vec3(gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1)).xy - .5;

    float g = length(uv);

    g = .001 / smoothstep(.0, 1. - clamp(fogDepth * .021, .0, .79), g);
    g *= 1. - length(uv)*2.;

    gl_FragColor = vec4(clamp(g / (fogDepth*0.1), 0., 1.));

}

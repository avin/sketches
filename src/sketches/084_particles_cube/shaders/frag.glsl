precision highp float;

uniform mat3 uvTransform;

varying float fogDepth;
uniform float fogDensity;

void main() {
    vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy - .5;

    float g = length(uv);

    g = smoothstep(fogDepth*.02, .0, g) * (1. - fogDepth*.02);

    gl_FragColor = vec4(g);
}

varying vec3 vpos;
varying float vtime;

uniform float time;

void main() {
    vpos = position;
    vtime = time;
    vec3 newPos = position;
//    newPos.x += sin(time + position.x * position.y);
//    newPos.y += cos(time + position.x * position.y * 1.1);
//    newPos.z += cos(time + position.x * position.y * 1.3);
    gl_PointSize = 50. + sin(time + position.x + position.y*2. + position.z)*20.;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}

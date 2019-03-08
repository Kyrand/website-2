precision mediump float;
// attribute vec3 position;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
uniform float time;
varying vec2 vUv;

void main() {
  vec3 newPos = position;
  // gl_Position = vec4(newPos.xy, 0.0, 1.0);
  vUv = (vec2(newPos.x, newPos.y) * 0.5 + 0.5);
  //vUv.x -= 1. - vUv.x;
  //vUv = (vec2(newPos.x, newPos.y));
  gl_Position = vec4(position.xy, 0.0, 1.0);
  //gl_Position = vec4(position, 1.0);
}

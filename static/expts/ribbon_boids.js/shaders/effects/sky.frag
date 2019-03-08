precision mediump float;
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
uniform float width, height, time;
varying vec2 vUv;

vec3 mix3(in vec3 a, in vec3 b, in vec3 c, in float center, in float t) {
  vec3 white = vec3(1.0);
  vec3 black = vec3(0.0);
  return
    a * mix(white, black, smoothstep(0.0, center, t)) +
    b * mix(black, white, smoothstep(0.0, center, t))
    * mix(white, black, smoothstep(center, 1.0, t)) +
    c * mix(black, white, smoothstep(center, 1.0, t));
}

void main() {
  //float aspect = width / height;
  float aspect = 1.33;

  float v = 1.0;
  // Foreground color
  vec3 col = v * vec3(.55, .75, 1.);

  // Background color
  col += (1.-v) * vec3(.0, .3, .5);

  //gl_FragColor = vec4(col, 1.0);
  gl_FragColor = vec4(1.-vUv.x, vUv.y, 0., 1.0);
}

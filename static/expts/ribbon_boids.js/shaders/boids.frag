#extension GL_OES_standard_derivatives : enable

varying vec4 vColor;
varying float z;
varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 color;


// void main() {
//   // Fake colors for now
//   //vec2 uPos = ( gl_FragCoord.xy / resolution.xy );

//   float fac = 0.2 + ( 1000. - z ) / 1000.;
//   float z2 = 0.2 + ( 1000. - z ) / 1000. * vColor.x;
//   //gl_FragColor = vec4( z2, z2, z2, 1. );
//   vec4 v = vColor * fac;

//   gl_FragColor = vec4( vUv.x, vUv.y, 1., 1. );
//   //gl_FragColor = vec4( uPos.x, uPos.y, 1., 1. );

// }

varying vec3 vViewPosition;

void main() {

  vec3 normal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
  // calc the dot product and clamp
  // 0 -> 1 rather than -1 -> 1
  vec3 light = vec3(0.5, 0.2, 1.0);
  //vec3 light = vec3(0., 1.0, 0.);

  // ensure it's normalized
  light = normalize(light);

  // calculate the dot product of
  // the light to the vertex normal
  float dProd = max(0.2, dot(normal, light));
  //float dProd = abs(dot(vNormal, light));

  // feed into our frag colour
  //gl_FragColor = vColor;
  gl_FragColor = vec4(dProd, // R
                      0., //dProd, // G
                      0., //dProd, // B
                      1.0);  // A

}

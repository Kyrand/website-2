attribute vec2 reference;
attribute float ribbonVertex;

attribute vec3 birdColor;

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

varying vec4 vColor;
varying float z;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vel;
varying vec3 vViewPosition;

uniform float time;

#define TWO_PI 6.28318530718

void main() {
  vUv = uv;
  //vNormal = normalize(modelMatrix * normal);

  vec4 tmpPos = texture2D( texturePosition, reference );
  vec3 pos = tmpPos.xyz;
  vec3 velocityAbs = texture2D( textureVelocity, reference ).xyz;
  vec3 velocity = normalize(velocityAbs);

  vec3 newPosition = position;

  vColor = vec4( birdColor, 1.0 );
  // if ( birdVertex == 4.0 || birdVertex == 7.0 ) {
  //   // flap wings
  //   newPosition.y = sin( tmpPos.w ) * 5.;
  //   vColor = vec4(1.0, 0.0, 0.0, 1.0);
  // }
  float offset = length(reference) * TWO_PI;


  float segment = floor(20. * (1.-abs(ribbonVertex)));
  if(segment == 0.) {
    newPosition.x = 0.2;
  }
  else if(segment == 1.) {
    newPosition.x *= 2.;
  }

  else if(segment > 3.){
    newPosition.y = 8. * sin(offset + time/1000. * TWO_PI + ribbonVertex * TWO_PI * length(velocityAbs) * .15);
  }

  newPosition = mat3( modelMatrix ) * newPosition;


  velocity.z *= -1.;
  float xz = length( velocity.xz );
  float xyz = 1.;
  float x = sqrt( 1. - velocity.y * velocity.y );

  float cosry = velocity.x / xz;
  float sinry = velocity.z / xz;

  float cosrz = x / xyz;
  float sinrz = velocity.y / xyz;

  mat3 maty =  mat3(
                    cosry, 0, -sinry,
                    0    , 1, 0     ,
                    sinry, 0, cosry

                    );

  mat3 matz =  mat3(
                    cosrz , sinrz, 0,
                    -sinrz, cosrz, 0,
                    0     , 0    , 1
                    );

  newPosition =  maty * matz * newPosition;
  newPosition += pos;
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  vViewPosition = -mvPosition.xyz;

  z = newPosition.z;
  vec4 p = viewMatrix * vec4(newPosition, 1.);
  // vec4 vNormal4 = viewMatrix * vec4(maty * matz * normal, 1.0);
  // vNormal = normalize(vNormal4.xyz);
  x = dot(vec3(maty * matz * normal), normalize(p.xyz));
  x = abs(x);
  vColor = vec4(x, 0., 0., 1.);

  gl_Position = projectionMatrix *  viewMatrix  * vec4( newPosition, 1.0 );
}

import * as THREE from "three"

import vert from "./sky.vert"
//import frag from "./sky.perlin.frag"
import frag from "./sky.orig.frag"

let plane = new THREE.PlaneGeometry(2., 2., 1, 1)

let uniforms = {
  time: {value: 1.0},
  width: window.innerWidth,
  height: window.innerHeight
}

let material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: vert,
  fragmentShader: frag,
  //side: THREE.DoubleSide
} )

let materialBasic = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

material.depthTest = false
let mesh = new THREE.Mesh(plane, material)

//mesh.rotation.x = Math.PI/2
// mesh.position.y = 1000
//mesh.updateMatrix()

export default mesh

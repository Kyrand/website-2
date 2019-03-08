import * as THREE from "three"
import OrbitControls from "three-orbitcontrols"
import WEBGL from "./js/WebGL"
import {Stats} from "three-stats"
import GPUComputationRenderer from "./js/GPUComputationRenderer"
import dat from "dat-gui"
import "./js/RibbonGeometry"
import "./js/BirdGeometry"
import events from "./js/events"

import sky from "./shaders/effects/sky"

import ribbonFrag from "./shaders/boids.frag"
import ribbonVert from "./shaders/boids.vert"
import posFrag from "./shaders/pos.frag"
import velFrag from "./shaders/vel.frag"

window.THREE = THREE

if ( WEBGL.isWebGLAvailable() === false ) {

  document.body.appendChild( WEBGL.getWebGLErrorMessage() )

}

let hash = document.location.hash.substr( 1 )
if ( hash ) hash = parseInt( hash, 0 )

/* TEXTURE WIDTH FOR SIMULATION */
let WIDTH = hash || 32
let BIRDS = WIDTH * WIDTH


let evts, container, stats
let camera, scene, renderer, controls, clock, i
// let mouseX = 0, mouseY = 0

// let windowHalfX = window.innerWidth / 2
// let windowHalfY = window.innerHeight / 2

let BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2

document.getElementById( 'ribbon-fish' ).innerText = BIRDS

window.change = function( n ) {

  location.hash = n
  location.reload()
  return false

}


let options = ''
for ( i = 1; i < 7; i ++ ) {

  let j = Math.pow( 2, i )
  options += '<a href="#" onclick="return change(' + j + ')">' + ( j * j ) + '</a> '

}
document.getElementById( 'options' ).innerHTML = options

let last = performance.now()

let gpuCompute
let velocityVariable
let positionVariable
let positionUniforms
let velocityUniforms
let birdUniforms

init()
animate()

function init() {

  container = document.createElement( 'div' )
  document.body.appendChild( container )

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 )
  camera.position.z = 1300

  controls = new OrbitControls(camera)
  controls.addEventListener("change", () => {
    console.log(`Camera pos: ${JSON.stringify(camera.position)}`)
    console.log(`Camera rotation: ${JSON.stringify(camera.rotation)}`)
  })

  scene = new THREE.Scene()
  clock = new THREE.Clock()

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )
  container.appendChild( renderer.domElement )

  evts = events(camera, renderer)


  stats = new Stats()
  container.appendChild( stats.dom )

  initEnvironment()
  initComputeRenderer()
  initGUI()
  initBirds()

}

function initGUI() {

  let gui = new dat.GUI()

  let effectController = {
    seperation: 20.0,
    alignment: 20.0,
    cohesion: 20.0,
    freedom: 0.75
  }

  let valuesChanger = function () {

    velocityUniforms.seperationDistance.value = effectController.seperation
    velocityUniforms.alignmentDistance.value = effectController.alignment
    velocityUniforms.cohesionDistance.value = effectController.cohesion
    velocityUniforms.freedomFactor.value = effectController.freedom

  }

  valuesChanger()

  let boidParams = gui.addFolder("Boid params")

  boidParams.add( effectController, "seperation", 0.0, 100.0, 1.0 ).onChange( valuesChanger )
  boidParams.add( effectController, "alignment", 0.0, 100, 0.001 ).onChange( valuesChanger )
  boidParams.add( effectController, "cohesion", 0.0, 100, 0.025 ).onChange( valuesChanger )
  boidParams.close()

  let envController = {
    background: "#00b9d8"
  }

  let envChanger = () => {
    scene.background.setHex(parseInt(envController.background.replace("#", "0x"), 16))
  }

  let envParams = gui.addFolder("Environment")
  envParams.addColor(envController, "background").onChange(envChanger)

}

function initEnvironment() {
  scene.background = new THREE.Color(0xffffff)
  //scene.background = new THREE.Color(0x00b9d8)
  //scene.fog = new THREE.Fog( 0xffffff, 100, 1000 )

  scene.add(sky)
  // let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 )
  // hemiLight.color.setHSL( 0.6, 0.75, 0.5 )
  // hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 )
  // hemiLight.position.set( 0, 500, 0 )
  // scene.add( hemiLight )

}

function initComputeRenderer() {

  gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer )

  let dtPosition = gpuCompute.createTexture()
  let dtVelocity = gpuCompute.createTexture()
  fillPositionTexture( dtPosition )
  fillVelocityTexture( dtVelocity )

  velocityVariable = gpuCompute.addVariable( "textureVelocity", velFrag, dtVelocity )
  positionVariable = gpuCompute.addVariable( "texturePosition", posFrag, dtPosition )

  gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] )
  gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] )

  positionUniforms = positionVariable.material.uniforms
  velocityUniforms = velocityVariable.material.uniforms

  positionUniforms.time = { value: 0.0 }
  positionUniforms.delta = { value: 0.0 }
  velocityUniforms.time = { value: 1.0 }
  velocityUniforms.delta = { value: 0.0 }
  velocityUniforms.testing = { value: 1.0 }
  velocityUniforms.seperationDistance = { value: 1.0 }
  velocityUniforms.alignmentDistance = { value: 1.0 }
  velocityUniforms.cohesionDistance = { value: 1.0 }
  velocityUniforms.freedomFactor = { value: 1.0 }
  velocityUniforms.predator = { value: new THREE.Vector3() }
  velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed( 2 )

  velocityVariable.wrapS = THREE.RepeatWrapping
  velocityVariable.wrapT = THREE.RepeatWrapping
  positionVariable.wrapS = THREE.RepeatWrapping
  positionVariable.wrapT = THREE.RepeatWrapping

  let error = gpuCompute.init()
  if ( error !== null ) {

    console.error( error )
  }

}

function initBirds() {

  //let geometry = new THREE.BirdGeometry(WIDTH)
  let geometry = new THREE.RibbonGeometry(WIDTH, 30, 3, 20)

  // For Vertex and Fragment
  birdUniforms = {
    color: { value: new THREE.Color( 0xff2200 ) },
    texturePosition: { value: null },
    textureVelocity: { value: null },
    time: { value: 1.0 },
    delta: { value: 0.0 }
  }

  // ShaderMaterial
  let material = new THREE.ShaderMaterial( {
    uniforms: birdUniforms,
    vertexShader: ribbonVert,
    fragmentShader: ribbonFrag,
    side: THREE.DoubleSide
  } )

  let birdMesh = new THREE.Mesh( geometry, material )
  birdMesh.rotation.y = Math.PI / 2
  birdMesh.matrixAutoUpdate = false
  birdMesh.updateMatrix()
  // birdMesh.setDrawMode(THREE.TriangleStripDrawMode)

  scene.add( birdMesh )

}

function fillPositionTexture( texture ) {

  let theArray = texture.image.data

  for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {

    let x = Math.random() * BOUNDS - BOUNDS_HALF
    let y = Math.random() * BOUNDS - BOUNDS_HALF
    let z = Math.random() * BOUNDS - BOUNDS_HALF

    theArray[ k + 0 ] = x
    theArray[ k + 1 ] = y
    theArray[ k + 2 ] = z
    theArray[ k + 3 ] = 1

  }

}

function fillVelocityTexture( texture ) {

  let theArray = texture.image.data

  for ( let k = 0, kl = theArray.length; k < kl; k += 4 ) {

    let x = Math.random() - 0.5
    let y = Math.random() - 0.5
    let z = Math.random() - 0.5

    theArray[ k + 0 ] = x * 10
    theArray[ k + 1 ] = y * 10
    theArray[ k + 2 ] = z * 10
    theArray[ k + 3 ] = 1

  }

}


//

function animate() {

  requestAnimationFrame( animate )

  controls.update()
  stats.update()

  render()

}

function render() {

  let now = performance.now()
  let delta = ( now - last ) / 1000

  if ( delta > 1 ) delta = 1 // safety cap on large deltas
  last = now

  positionUniforms.time.value = now
  positionUniforms.delta.value = delta
  velocityUniforms.time.value = now
  velocityUniforms.delta.value = delta
  birdUniforms.time.value = now
  birdUniforms.delta.value = delta

  velocityUniforms.predator.value.set( 0.5 * evts.mouseX / evts.windowHalfX, - 0.5 * evts.mouseY / evts.windowHalfY, 0 )

  evts.mouseX = 10000
  evts.mouseY = 10000

  gpuCompute.compute()

  birdUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture
  birdUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture

  // Effects
  sky.material.uniforms.time.value = clock.getElapsedTime()

  renderer.render( scene, camera )

}

if (module.hot) {
  module.hot.dispose(function () {
    window.location.reload();
  });
}

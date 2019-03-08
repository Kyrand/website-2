import * as THREE from "three"

THREE.RibbonGeometry = function(gridWidth=64, length=10, width=3, segments=10 ) {

  let numRibbons = gridWidth * gridWidth
  let triangles = numRibbons * segments * 2
  let points = triangles * 3

  THREE.BufferGeometry.call(this)

  let vertices = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 )
  let ribbonColors = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 )
  let references = new THREE.BufferAttribute( new Float32Array( points * 2 ), 2 )
  let ribbonVertex = new THREE.BufferAttribute( new Float32Array( points ), 1 )
  this.addAttribute( 'position', vertices )
  this.addAttribute( 'ribbonColor', ribbonColors )
  this.addAttribute( 'reference', references )
  this.addAttribute( 'ribbonVertex', ribbonVertex )

  let dz = length/(segments - 1)
  let dx = width/2

  let vIndex = 0
  let tIndex = 0

  for(let r=0; r<numRibbons; r++){

    for(let i=0; i<segments-1; i++) {
      let z = i * dz
      vertsPush(-dx, 0, z,
                -dx, 0, z+dz,
                 dx, 0, z)

      ribbonVertex.array[tIndex++] = -z/length
      ribbonVertex.array[tIndex++] = -(z + dz)/length
      ribbonVertex.array[tIndex++] = z/length

      vertsPush( dx, 0, z,
                -dx, 0, z+dz,
                 dx, 0, z+dz)

      ribbonVertex.array[tIndex++] =  z/length
      ribbonVertex.array[tIndex++] =  -(z + dz)/length
      ribbonVertex.array[tIndex++] =  (z + dz)/length
    }
  }

  function vertsPush() {
    for ( let i = 0; i < arguments.length; i ++ ) {
      vertices.array[ vIndex++ ] = arguments[ i ]
    }
  }

  for ( var v = 0; v < triangles * 3; v ++ ) {

    var i = ~ ~ ( v / (segments*6) )
    var x = ( i % gridWidth ) / gridWidth
    var y = ~ ~ ( i / gridWidth ) / gridWidth

    var c = new THREE.Color(
      0x444444 +
        ~ ~ ( v / 9 ) / numRibbons * 0x666666
    )

    ribbonColors.array[ v * 3 + 0 ] = c.r
    ribbonColors.array[ v * 3 + 1 ] = c.g
    ribbonColors.array[ v * 3 + 2 ] = c.b

    references.array[ v * 2 ] = x
    references.array[ v * 2 + 1 ] = y

    // ribbonVertex.array[ v ] = v % 9

  }

  this.scale( 5, 5, 5 )
  this.computeVertexNormals()
  this.uvsNeedUpdate = true

}

THREE.RibbonGeometry.prototype = Object.create( THREE.BufferGeometry.prototype )

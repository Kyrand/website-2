export default function(camera, renderer) {

  let api = {}
  api.windowHalfX = window.innerWidth / 2
  api.windowHalfY = window.innerHeight / 2

  api.onWindowResize = () => {

    api.windowHalfX = window.innerWidth / 2
    api.windowHalfY = window.innerHeight / 2

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize( window.innerWidth, window.innerHeight )

  }

  api.onDocumentMouseMove = ( event ) => {

    api.mouseX = event.clientX - api.windowHalfX
    api.mouseY = event.clientY - api.windowHalfY

  }

  api.onDocumentTouchStart = ( event ) => {

    if ( event.touches.length === 1 ) {

      event.preventDefault()

      api.mouseX = event.touches[ 0 ].pageX - api.windowHalfX
      api.mouseY = event.touches[ 0 ].pageY - api.windowHalfY

    }

  }

  api.onDocumentTouchMove = ( event ) => {

    if ( event.touches.length === 1 ) {

      event.preventDefault()

      api.mouseX = event.touches[ 0 ].pageX - api.windowHalfX
      api.mouseY = event.touches[ 0 ].pageY - api.windowHalfY

    }

  }

  document.addEventListener( "mousemove", api.onDocumentMouseMove, false )
  document.addEventListener( "touchstart", api.onDocumentTouchStart, false )
  document.addEventListener( "touchmove", api.onDocumentTouchMove, false )

  window.addEventListener( "resize", api.onWindowResize, false )

  return api

}

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/GPUComputationRenderer.js":[function(require,module,exports) {
/**
 * @author yomboprime https://github.com/yomboprime
 *
 * GPUComputationRenderer, based on SimulationRenderer by zz85
 *
 * The GPUComputationRenderer uses the concept of variables. These variables are RGBA float textures that hold 4 floats
 * for each compute element (texel)
 *
 * Each variable has a fragment shader that defines the computation made to obtain the variable in question.
 * You can use as many variables you need, and make dependencies so you can use textures of other variables in the shader
 * (the sampler uniforms are added automatically) Most of the variables will need themselves as dependency.
 *
 * The renderer has actually two render targets per variable, to make ping-pong. Textures from the current frame are used
 * as inputs to render the textures of the next frame.
 *
 * The render targets of the variables can be used as input textures for your visualization shaders.
 *
 * Variable names should be valid identifiers and should not collide with THREE GLSL used identifiers.
 * a common approach could be to use 'texture' prefixing the variable name; i.e texturePosition, textureVelocity...
 *
 * The size of the computation (sizeX * sizeY) is defined as 'resolution' automatically in the shader. For example:
 * #DEFINE resolution vec2( 1024.0, 1024.0 )
 *
 * -------------
 *
 * Basic use:
 *
 * // Initialization...
 *
 * // Create computation renderer
 * var gpuCompute = new GPUComputationRenderer( 1024, 1024, renderer );
 *
 * // Create initial state float textures
 * var pos0 = gpuCompute.createTexture();
 * var vel0 = gpuCompute.createTexture();
 * // and fill in here the texture data...
 *
 * // Add texture variables
 * var velVar = gpuCompute.addVariable( "textureVelocity", fragmentShaderVel, pos0 );
 * var posVar = gpuCompute.addVariable( "texturePosition", fragmentShaderPos, vel0 );
 *
 * // Add variable dependencies
 * gpuCompute.setVariableDependencies( velVar, [ velVar, posVar ] );
 * gpuCompute.setVariableDependencies( posVar, [ velVar, posVar ] );
 *
 * // Add custom uniforms
 * velVar.material.uniforms.time = { value: 0.0 };
 *
 * // Check for completeness
 * var error = gpuCompute.init();
 * if ( error !== null ) {
 *		console.error( error );
  * }
 *
 *
 * // In each frame...
 *
 * // Compute!
 * gpuCompute.compute();
 *
 * // Update texture uniforms in your visualization materials with the gpu renderer output
 * myMaterial.uniforms.myTexture.value = gpuCompute.getCurrentRenderTarget( posVar ).texture;
 *
 * // Do your rendering
 * renderer.render( myScene, myCamera );
 *
 * -------------
 *
 * Also, you can use utility functions to create ShaderMaterial and perform computations (rendering between textures)
 * Note that the shaders can have multiple input textures.
 *
 * var myFilter1 = gpuCompute.createShaderMaterial( myFilterFragmentShader1, { theTexture: { value: null } } );
 * var myFilter2 = gpuCompute.createShaderMaterial( myFilterFragmentShader2, { theTexture: { value: null } } );
 *
 * var inputTexture = gpuCompute.createTexture();
 *
 * // Fill in here inputTexture...
 *
 * myFilter1.uniforms.theTexture.value = inputTexture;
 *
 * var myRenderTarget = gpuCompute.createRenderTarget();
 * myFilter2.uniforms.theTexture.value = myRenderTarget.texture;
 *
 * var outputRenderTarget = gpuCompute.createRenderTarget();
 *
 * // Now use the output texture where you want:
 * myMaterial.uniforms.map.value = outputRenderTarget.texture;
 *
 * // And compute each frame, before rendering to screen:
 * gpuCompute.doRenderTarget( myFilter1, myRenderTarget );
 * gpuCompute.doRenderTarget( myFilter2, outputRenderTarget );
 * 
 *
 *
 * @param {int} sizeX Computation problem size is always 2d: sizeX * sizeY elements.
 * @param {int} sizeY Computation problem size is always 2d: sizeX * sizeY elements.
 * @param {WebGLRenderer} renderer The renderer
  */
function GPUComputationRenderer(sizeX, sizeY, renderer) {
  this.variables = [];
  this.currentTextureIndex = 0;
  var scene = new THREE.Scene();
  var camera = new THREE.Camera();
  camera.position.z = 1;
  var passThruUniforms = {
    texture: {
      value: null
    }
  };
  var passThruShader = createShaderMaterial(getPassThroughFragmentShader(), passThruUniforms);
  var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), passThruShader);
  scene.add(mesh);

  this.addVariable = function (variableName, computeFragmentShader, initialValueTexture) {
    var material = this.createShaderMaterial(computeFragmentShader);
    var variable = {
      name: variableName,
      initialValueTexture: initialValueTexture,
      material: material,
      dependencies: null,
      renderTargets: [],
      wrapS: null,
      wrapT: null,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter
    };
    this.variables.push(variable);
    return variable;
  };

  this.setVariableDependencies = function (variable, dependencies) {
    variable.dependencies = dependencies;
  };

  this.init = function () {
    if (!renderer.extensions.get("OES_texture_float")) {
      return "No OES_texture_float support for float textures.";
    }

    if (renderer.capabilities.maxVertexTextures === 0) {
      return "No support for vertex shader textures.";
    }

    for (var i = 0; i < this.variables.length; i++) {
      var variable = this.variables[i]; // Creates rendertargets and initialize them with input texture

      variable.renderTargets[0] = this.createRenderTarget(sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter);
      variable.renderTargets[1] = this.createRenderTarget(sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter);
      this.renderTexture(variable.initialValueTexture, variable.renderTargets[0]);
      this.renderTexture(variable.initialValueTexture, variable.renderTargets[1]); // Adds dependencies uniforms to the ShaderMaterial

      var material = variable.material;
      var uniforms = material.uniforms;

      if (variable.dependencies !== null) {
        for (var d = 0; d < variable.dependencies.length; d++) {
          var depVar = variable.dependencies[d];

          if (depVar.name !== variable.name) {
            // Checks if variable exists
            var found = false;

            for (var j = 0; j < this.variables.length; j++) {
              if (depVar.name === this.variables[j].name) {
                found = true;
                break;
              }
            }

            if (!found) {
              return "Variable dependency not found. Variable=" + variable.name + ", dependency=" + depVar.name;
            }
          }

          uniforms[depVar.name] = {
            value: null
          };
          material.fragmentShader = "\nuniform sampler2D " + depVar.name + ";\n" + material.fragmentShader;
        }
      }
    }

    this.currentTextureIndex = 0;
    return null;
  };

  this.compute = function () {
    var currentTextureIndex = this.currentTextureIndex;
    var nextTextureIndex = this.currentTextureIndex === 0 ? 1 : 0;

    for (var i = 0, il = this.variables.length; i < il; i++) {
      var variable = this.variables[i]; // Sets texture dependencies uniforms

      if (variable.dependencies !== null) {
        var uniforms = variable.material.uniforms;

        for (var d = 0, dl = variable.dependencies.length; d < dl; d++) {
          var depVar = variable.dependencies[d];
          uniforms[depVar.name].value = depVar.renderTargets[currentTextureIndex].texture;
        }
      } // Performs the computation for this variable


      this.doRenderTarget(variable.material, variable.renderTargets[nextTextureIndex]);
    }

    this.currentTextureIndex = nextTextureIndex;
  };

  this.getCurrentRenderTarget = function (variable) {
    return variable.renderTargets[this.currentTextureIndex];
  };

  this.getAlternateRenderTarget = function (variable) {
    return variable.renderTargets[this.currentTextureIndex === 0 ? 1 : 0];
  };

  function addResolutionDefine(materialShader) {
    materialShader.defines.resolution = 'vec2( ' + sizeX.toFixed(1) + ', ' + sizeY.toFixed(1) + " )";
  }

  this.addResolutionDefine = addResolutionDefine; // The following functions can be used to compute things manually

  function createShaderMaterial(computeFragmentShader, uniforms) {
    uniforms = uniforms || {};
    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: getPassThroughVertexShader(),
      fragmentShader: computeFragmentShader
    });
    addResolutionDefine(material);
    return material;
  }

  this.createShaderMaterial = createShaderMaterial;

  this.createRenderTarget = function (sizeXTexture, sizeYTexture, wrapS, wrapT, minFilter, magFilter) {
    sizeXTexture = sizeXTexture || sizeX;
    sizeYTexture = sizeYTexture || sizeY;
    wrapS = wrapS || THREE.ClampToEdgeWrapping;
    wrapT = wrapT || THREE.ClampToEdgeWrapping;
    minFilter = minFilter || THREE.NearestFilter;
    magFilter = magFilter || THREE.NearestFilter;
    var renderTarget = new THREE.WebGLRenderTarget(sizeXTexture, sizeYTexture, {
      wrapS: wrapS,
      wrapT: wrapT,
      minFilter: minFilter,
      magFilter: magFilter,
      format: THREE.RGBAFormat,
      type: /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType,
      stencilBuffer: false,
      depthBuffer: false
    });
    return renderTarget;
  };

  this.createTexture = function () {
    var a = new Float32Array(sizeX * sizeY * 4);
    var texture = new THREE.DataTexture(a, sizeX, sizeY, THREE.RGBAFormat, THREE.FloatType);
    texture.needsUpdate = true;
    return texture;
  };

  this.renderTexture = function (input, output) {
    // Takes a texture, and render out in rendertarget
    // input = Texture
    // output = RenderTarget
    passThruUniforms.texture.value = input;
    this.doRenderTarget(passThruShader, output);
    passThruUniforms.texture.value = null;
  };

  this.doRenderTarget = function (material, output) {
    mesh.material = material;
    renderer.render(scene, camera, output);
    mesh.material = passThruShader;
  }; // Shaders


  function getPassThroughVertexShader() {
    return "void main()	{\n" + "\n" + "	gl_Position = vec4( position, 1.0 );\n" + "\n" + "}\n";
  }

  function getPassThroughFragmentShader() {
    return "uniform sampler2D texture;\n" + "\n" + "void main() {\n" + "\n" + "	vec2 uv = gl_FragCoord.xy / resolution.xy;\n" + "\n" + "	gl_FragColor = texture2D( texture, uv );\n" + "\n" + "}\n";
  }
}
},{}],"../../../../../../../../usr/local/share/.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44777" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../../../../usr/local/share/.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/GPUComputationRenderer.js"], null)
//# sourceMappingURL=/GPUComputationRenderer.5360835f.map
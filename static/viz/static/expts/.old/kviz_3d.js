/* global $, _  */
(function(my3D, $, _) {
    'use strict';
    my3D.BasicViewer = function() {
    };
    my3D.CAMERA_DEFAULT_POS = new THREE.Vector3(0, 0, 3000);
    my3D.CAMERA_DEFAULT_ROT = new THREE.Vector3(0, 0, 0);
    my3D.CAMERA_TYPE_ORTHO = 0;
    my3D.CAMERA_TYPE_PERSPECTIVE = 1;
    my3D.BasicViewer.prototype = {
        init: function(parent, width, height, focusPoint, camera) {
            this.focusPoint = typeof focusPoint !== 'undefined'? focusPoint: new THREE.Vector3(0, 0, 2000);
            this.cameraType = typeof camera !== 'undefined'? camera: my3D.CAMERA_TYPE_PERSPECTIVE;
            this.mouse = {x:0, y:0, vx:0, vy:0, down:false, groupIntersectPoint:new THREE.Vector3()};
            // var VIZ ={};
            this.scene = new THREE.Scene();
            // var width = window.innerWidth, height = window.innerHeight;
            this.width = width;
            this.parent = parent;
            this.height = height;

            if(this.cameraType === my3D.CAMERA_TYPE_ORTHO){
                this.camera = new THREE.OrthographicCamera(40, width/height , 1, 10000);
            }
            else{
                this.camera = new THREE.PerspectiveCamera(40, width/height , 1, 10000);
                this.camera.setLens(30);
            }
            this.camera.position = my3D.CAMERA_DEFAULT_POS.clone();
            //this.camera.position.z = 3000;
            this.projector = new THREE.Projector();
            // this.renderer = new THREE.WebGLRenderer();
            this.postInit(parent, width, height);
            return this;
        },

        postInit: function() {},

        render: function() {
            // var p = this.camera.position, r = this.camera.rotation;
            // console.log('Cam pos: ' + p.x + ' ' + p.y + ' ' + p.z);
            // console.log('Cam rot: ' + r.x + ' ' + r.y + ' ' + r.z);
            this.renderer.render(this.scene, this.camera);
            if(this.onDebug){
                this.onDebug();
            }
        },
        
        onWindowResize: function () {
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);
            this.render();
        },
        
        windowResize: function (width, height) {
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            this.render();
        },

        resetCamera: function() {
            // this.controls.object.position = my3D.CAMERA_DEFAULT_POS.clone();
            // this.controls.object.rotation = my3D.CAMERA_DEFAULT_ROT.clone();
            this.controls.reset();
        },
        
        animate: function () {
            requestAnimationFrame(this.animate.bind(this));
            TWEEN.update();
            this.controls.update();
        },
        
        transform: function (layout) {
            var duration = 1000;

            TWEEN.removeAll();

            this.scene.children.forEach(function (object){
                // var newPos = object.element.__data__[layout].position;
                var newPos = object.element.newPosition;
                var coords = new TWEEN.Tween(object.position)
                    .to({x: newPos.x, y: newPos.y, z: newPos.z}, duration)
                    .easing(TWEEN.Easing.Sinusoidal.InOut)
                    .start();

                // var newRot = object.element.__data__[layout].rotation;
                var newRot = object.element.newRotation;
                if(newRot){
                    var rotate = new TWEEN.Tween(object.rotation)
                        .to({x: newRot.x, y: newRot.y, z: newRot.z}, duration)
                        .easing(TWEEN.Easing.Sinusoidal.InOut)
                        .start();
                }
            });
            
            var update = new TWEEN.Tween(this)
                .to({}, duration)
                .onUpdate(this.render.bind(this))
                .start();
        },

        toggleTrackball: function() {
            this.controls.enabled = this.controls.enabled?false:true;
        },
        
    }; 

    my3D.BasicCSS3DViewer = function() {
    }; 

    my3D.BasicCSS3DViewer.prototype = Object.create(my3D.BasicViewer.prototype);

    _.extend(my3D.BasicCSS3DViewer.prototype, {
        postInit: function(parent, width, height) {
            console.log('Creating CSS3DViewer...');
            var vw = this, controls, renderer = this.renderer = new THREE.CSS3DRenderer();
            renderer.setSize(width, height);
            renderer.domElement.style.position = 'absolute';
            parent.append(renderer.domElement);
            // document.getElementById('container').appendChild(renderer.domElement);
            // we have a jquery element:
            d3.select(renderer.domElement)
                .classed('v3canvas', true)
                .on('mousedown', function(e) {
                    var ray;
                    vw.mouse.down = true; 
                    ray = vw.calculateGroupIntersect();
                    vw.mouse.zoomVector = ray.ray.direction.clone().negate();
                    console.log('You clicked a viewer');
                })
                .on('mouseup', function(e) {
                    vw.selectedGroup = false;
                    vw.render();
                })
                .on('mousemove', function(e) {
                    if(vw.selectedGroup){
                        var ray,
                        tmpV = vw.mouse.groupIntersectPoint;
                        vw.calculateGroupIntersect();
                        tmpV.subVectors(vw.mouse.groupIntersectPoint, tmpV);
                        if(d3.event.shiftKey){// zoom with x-axis
                            // tmpV.z = tmpV.x; tmpV.y=0; tmpV.x=0;
                            tmpV = vw.mouse.zoomVector.clone().multiplyScalar(tmpV.x);
                            }
                        vw.selectedGroup.move(tmpV);
                        console.log('Mouse moved by: [' + tmpV.x + ',' + tmpV.y + ']');
                    }
                })
            ;
            
            d3.select('body')
                .on('keydown', function() {
                    var KEYCODES = {G:71, U:85, H:72, V:86, J:74, K:75, L:76},
                    ORIENTS = {72:my3D.HORIZONTAL, 86:my3D.VERTICAL};
                    if(vw.mouseOverGroup){
                        var kc = d3.event.keyCode;
                        switch(kc){
                        case KEYCODES.V:
                        case KEYCODES.H:
                            vw.mouseOverGroup.orientation = ORIENTS[kc];
                            vw.mouseOverGroup.updatePositions();
                            vw.transform();
                            vw.render();
                            break;
                        case KEYCODES.G:
                            vw.mouseOverGroup.focusGroup();
                            break;
                        case KEYCODES.U:
                            vw.mouseOverGroup.unfocusGroup();
                            break;
                        case KEYCODES.J:
                            // send plane backwards
                            vw.mouseOverGroup.move(new THREE.Vector3(0,0,-500));
                            break;
                        case KEYCODES.K:
                            // send plane forwards
                            vw.mouseOverGroup.move(new THREE.Vector3(0,0,500));
                            break;
                           } 
                       } 
                })
            ;
            // d3.select(renderer.domElement)
            //     .on('mousedown', vw.onMouseDown.bind(vw))
            //     .on('mouseup', vw.onMouseUp.bind(vw))
            //     .on('mousemove', vw.onMouseMove.bind(vw))
            // ;
            
            controls = this.controls = new THREE.TrackballControls(this.camera, renderer.domElement);
            controls.rotateSpeed = 0.5;
            controls.minDistance = 100;
            controls.maxDistance = 6000;
            controls.addEventListener('change', this.render.bind(this));
            // usually just for demos...
            controls.enabled = false;
            // chart-specific functions
            this.dataplanes = [];
            this.dataplanesByGUID = {};
            this.singleFocus = false; // single-object per group
            this.focusGroup = new my3D.DataPlane(this, this.focusPoint.clone(),undefined,undefined,false);
            d3.select(this.focusGroup.frame.background.element).classed('focus-group', true);
            this.mouseOverGroup = false;
        },
            
        getMouseCoords: function() {
            var mp = d3.mouse(this.renderer.domElement);
            this.mouse.x = mp[0];
            this.mouse.y = mp[1];
            this.mouse.vx = (mp[0]/this.renderer.domElement.offsetWidth)*2-1;
            this.mouse.vy = -(mp[1]/this.renderer.domElement.offsetHeight)*2+1;
        },

        getMouseRay: function() {
            var vector, ray;
            this.getMouseCoords();
            this.camera.lookAt(this.scene.position);
            vector = new THREE.Vector3( this.mouse.vx, this.mouse.vy, 0.5 );
            this.projector.unprojectVector( vector, this.camera );
            ray = new THREE.Raycaster( this.camera.position, vector.sub(this.camera.position).normalize() );
            return ray;
        },

        calculateGroupIntersect: function() {
            var plane, ray = this.getMouseRay(), planeZ = 0;
            if(this.selectedGroup){
                planeZ = this.selectedGroup.position.z;
            }
            plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), planeZ);
            this.mouse.groupIntersectPoint = ray.ray.intersectPlane(plane);
            return ray;
        },
        
        getIntersectObjects: function() {
            var vector, intersects, vw = this, camera = this.camera,
            ray = this.getMouseRay();
            this.mouse.down = true;
            
            intersects = ray.intersectObjects( this.scene.children );

            if ( intersects.length > 0 ) {

                if ( this.INTERSECTED !== intersects[ 0 ].object ) {

                    if ( this.INTERSECTED ){
                        this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
                    }
                    this.INTERSECTED = intersects[ 0 ].object;
                    console.log('Selected object: ' + this.INTERSECTED);
                }

            } else {

                if ( this.INTERSECTED ){
                    // this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
                }
                this.INTERSECTED = null;

            }
        },

        onMouseUp: function() {
            this.INTERSECTED = null;
        },

        onMouseMove: function() {
            if(this.INTERSECTED){
            }
        },
        
        addChart: function(chart, group) {
            var pos = group?group.position.clone(): THREE.Vector3();
            console.log('Registering chart: ' + chart);
            var obj = this.objectify2(chart, pos); 
            obj.inFocus = false;
            chart.guid = kutils.guidGenerator();
            chart.obj = obj;
            obj.guid = chart.guid;
            if(group){
                obj.inGroup = group.guid;
                group.addObject(obj);
                chart.inGroup = group.guid;
            }
            this.transform();
            return obj;
        },

        addDataplane: function(dp) {
            this.dataplanes.push(dp);
            this.dataplanesByGUID[dp.guid] = dp;
        },

        objectify: function() {
            var viewer = this;
            return function(d) {
                var object = new THREE.CSS3DObject(this);
                object.position = d.random.position;
                viewer.scene.add(object);
                return object;
            };
        },

        objectify2: function(el, pos) {
            var object = new THREE.CSS3DObject(el);
            object.position = pos;
            object.element.newPosition = pos;
            this.scene.add(object);
            return object;
        },

        selectGroup: function(groupID) {
            this.selectedGroup = this.dataplanesByGUID[groupID];
        },

        setMouseOverGroup: function(groupID) {
            this.mouseOverGroup = this.dataplanesByGUID[groupID];
        },

        unselectGroup: function(group) {
            
        },

        onDebug: function() {
            var vw=this, db = d3.select('.debugbox'),
            p = this.camera.position, m = this.mouse.groupIntersectPoint;
            db.html('');
            db.append('div').attr('class', 'elinfo')
                .text(_.string.sprintf('Camera pos.: [%4.1f, %4.1f, %4.1f]', p.x, p.y, p.z));
            db.append('div').attr('class', 'elinfo')
                .text(_.string.sprintf('Mouse pos (canvas).: [%4d, %4d]', vw.mouse.x, vw.mouse.y));
            db.append('div').attr('class', 'elinfo')
                .text(_.string.sprintf('Mouse vector.: [%4.3f, %4.3f]', vw.mouse.vx, vw.mouse.vy));
            if(m){
            db.append('div').attr('class', 'elinfo')
                .text(_.string.sprintf('Mouse group-intersect: [%4d, %4d, %4d]', m.x, m.y, m.z));
                }
            db.append('h6').text('Objects in Scene:');
            db.append('ul').selectAll('.objects').data(this.scene.children).enter()
                .append('li').classed('elinfo', true)
                .classed('selected', function(d) {
                    if(vw.selectedGroup){
                        return d.element.inGroup === vw.selectedGroup.guid;
                    }
                    return false;
                })
                .text(function(d){
                    var type = d.guid?d.guid.slice(0,4): 'frame';
                    return _.string.sprintf('%12s: [%4d, %4d, %4d]', type, d.position.x, d.position.y, d.position.z);
                }) 
            ;
            db.append('h6').text('Planes in Scene:');
            db.selectAll('.objects').data(this.dataplanes).enter()
                .append('div').classed('elinfo', true)
                .text(function(d){
                    return _.string.sprintf('%12s: [%4d, %4d, %4d]', d.guid.slice(0,4), d.position.x, d.position.y, d.position.z);
                });
            
        }

        
        
    });
    
}(window.my3D = window.my3D || {}, $, _));

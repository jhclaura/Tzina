// TODO:
	//Package up dependencies as modules
	//Solve the shader scaling and move shaders to use GLSLIFY
	//Solve Geometry creation so it renders mesh and not particals

//Setting up stuff
var camera, scene, renderer;

//Test Depth Take - From Lupo's Take
var lupo_test_take = [
	{  "name" : "./assets/footage/take_one_short",
		 "mindepth" : 2436.562500000,
		 "maxdepth" : 3185.815673828
	 }
 ];

 var hanna_idle = [
	{  "name" : "./assets/footage/hanna_idle",
		 "mindepth" : 2138.454101562,
		 "maxdepth" : 3047.334472656
	 }
 ];

var ray, projector, mouse, controls;
var videos, objects;
var clickCount;

var gui;
//
var videoPosition = new THREE.Vector3(0,400,-2000);
var lightBehavior;

var init = function () {

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 100000 );
	camera.position.set(-30,-8,-700);

	cameraTarget = new THREE.Vector3( 0, 0, - 1000 );

	scene = new THREE.Scene();
	scene.add( camera );

	controls = new THREE.OrbitControls(camera);

		// video = new RGBDVideo( lupo_test_take[0] );
		video = new RGBDVideo( hanna_idle[0] );
		video.rotation.set(0,135.09999999999997,0);
		video.position.copy( videoPosition );
		scene.add( video );

	// LIGHT
	var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 0.75 );
	light.position.set( -1, - 0.5, -1 );
	scene.add( light );

	renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight);
	renderer.domElement.style.width = window.innerWidth + 'px';
	renderer.domElement.style.height = window.innerHeight + 'px';

	// -------------------------- ANIM START -------------------------------
		renderer.setClearColor(0x000000, 1);
	// -------------------------- ANIM END ---------------------------------
	
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );


	//DAT GUI Controls
	var tzina = function() {
  this.start = function() {video.play();},
	this.stop = function() {video.pause();};
	};
	gui = new dat.GUI();
	var text = new tzina();
	gui.add(text, 'start');
	gui.add(text, 'stop');

	// -------------------------- ANIM START -------------------------------
		clickCount = 0;
		lightBehavior = new function() {
			this.domeInfluence = 0.01;
			this.domeInfluence2 = 0.01;
			this.chase = function() {
				lightToChase = true;
				clickCount = 0;
				for(var i=0; i<lightSource.length; i++){
					lightSource[i].setToChase(true);
				}
			};
			this.away = function() {
				lightToChase = false;
				clickCount = 0;
				for(var i=0; i<lightSource.length; i++){
					lightSource[i].setToChase(false);
				}
			};
			this.awayOneByOne = function() {
				lightToChase = false;

				if( clickCount<lightSource.length-1 ){
					lightSource[clickCount].setToChase(false);
					clickCount++;
					console.log(lightSource[clickCount].toChase);
				}
			};
			this.drop = function() {
				for(var i=0; i<particleGroup.emitters.length; i++){
					particleGroup.emitters[i].duration=1;
					particleGroup.emitters[i].enable();
				}
			};
			this.dropLonger = function() {
				for(var i=0; i<particleGroup.emitters.length; i++){
					particleGroup.emitters[i].duration=10;
					particleGroup.emitters[i].enable();
				}
			};
			this.domeUpdate = function() {
				dome.morphTargetInfluences[0] = lightBehavior.domeInfluence;
				dome.morphTargetInfluences[1] = lightBehavior.domeInfluence2;
				UpdateVertices();
			};
			this.showTwig = function() {
				for(var i=0; i<domeMorphTargets.length; i++){
					TweenMax.to( domeMorphTargets[i].mesh.children[0].scale, 2, { x: 1, y: 1, z: 1 } );
					TweenMax.to( domeMorphTargets[i].mesh.children[1].scale, 2, { x: 0.01, y: 0.01, z: 0.01 } );
					TweenMax.to( domeMorphTargets[i].mesh.children[2].scale, 2, { x: 0.01, y: 0.01, z: 0.01 } );
				}
			};
			this.showLeaf = function() {
				for(var i=0; i<domeMorphTargets.length; i++){
					TweenMax.to( domeMorphTargets[i].mesh.children[1].scale, 2, { x: 1, y: 1, z: 1, ease: Power2.easeOut } );
					TweenMax.to( domeMorphTargets[i].mesh.children[0].scale, 2.5, { x: 0.01, y: 0.01, z: 0.01, ease: Power4.easeIn } );
					TweenMax.to( domeMorphTargets[i].mesh.children[2].scale, 2.5, { x: 0.01, y: 0.01, z: 0.01, ease: Power4.easeIn } );
				}
			};
			this.showEvil = function() {
				for(var i=0; i<domeMorphTargets.length; i++){
					TweenMax.to( domeMorphTargets[i].mesh.children[2].scale, 1.5, { x: 1, y: 1, z: 1 } );
					TweenMax.to( domeMorphTargets[i].mesh.children[1].scale, 1.5, { x: 0.01, y: 0.01, z: 0.01 } );
					TweenMax.to( domeMorphTargets[i].mesh.children[0].scale, 1.5, { x: 0.01, y: 0.01, z: 0.01 } );
				}
			};
			this.toBrown = function() {
				// 59.6, 35.3, 9
				TweenMax.to( twigMat.color, 2, { r: 0.59, g: 0.35, b: 0.1 } );
				TweenMax.to( leafMat.color, 2, { r: 0.59, g: 0.35, b: 0.1 } );
				TweenMax.to( evilMat.color, 2, { r: 0.59, g: 0.35, b: 0.1 } );
			};
			this.toPurple = function() {
				// 35.3, 9, 59.6
				TweenMax.to( twigMat.color, 2, { r: 0.35, g: 0.1, b: 0.59 } );
				TweenMax.to( leafMat.color, 2, { r: 0.35, g: 0.1, b: 0.59 } );
				TweenMax.to( evilMat.color, 2, { r: 0.35, g: 0.1, b: 0.59 } );
			};
			this.toGreen = function() {
				// 9, 59.6, 35.3
				TweenMax.to( twigMat.color, 2, { r: 0.1, g: 0.59, b: 0.35 } );
				TweenMax.to( leafMat.color, 2, { r: 0.1, g: 0.59, b: 0.35 } );
				TweenMax.to( evilMat.color, 2, { r: 0.1, g: 0.59, b: 0.35 } );
			};
			this.toPink = function() {
				// 87.8, 19.2, 52.9
				TweenMax.to( twigMat.color, 2, { r: 0.88, g: 0.19, b: 0.53 } );
				TweenMax.to( leafMat.color, 2, { r: 0.88, g: 0.19, b: 0.53 } );
				TweenMax.to( evilMat.color, 2, { r: 0.88, g: 0.19, b: 0.53 } );
			};
		}
		gui.add(lightBehavior, 'domeInfluence', 0, 1).onChange(lightBehavior.domeUpdate);
		gui.add(lightBehavior, 'domeInfluence2', 0, 1).onChange(lightBehavior.domeUpdate);
		gui.add(lightBehavior, 'showTwig');
		gui.add(lightBehavior, 'showLeaf');
		gui.add(lightBehavior, 'showEvil');
		//
		gui.add(lightBehavior, 'toBrown');
		gui.add(lightBehavior, 'toPurple');
		gui.add(lightBehavior, 'toGreen');
		gui.add(lightBehavior, 'toPink');
		//
		SetupAnim();

		var lookupTable=[];
		for (var i=0; i<50; i++) {
		  lookupTable.push(Math.random());
		}

		function UpdateVertices () {
			var morphTargets = dome.geometry.morphTargets;
			var morphInfluences = dome.morphTargetInfluences;

			// get morph geometry update position data
			for(var i=0; i<shieldGeo.vertices.length; i++){
				var centerV = new THREE.Vector3(0,-2000*lightBehavior.domeInfluence2,0);
				var vA = new THREE.Vector3();
				var tempA = new THREE.Vector3();

				for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {
					var influence = morphInfluences[ t ];
					var target = morphTargets[t].vertices[i];
					vA.addScaledVector( tempA.subVectors( target, shieldGeo.vertices[i] ), influence );
				}

				vA.add( shieldGeo.vertices[i] );
				tempA.set( lookupTable[i%50]*100, lookupTable[(i+1)%50]*100, lookupTable[(i+2)%50]*100 );
				vA.add( tempA );

				domeMorphTargets[i].mesh.position.copy( vA );
				if(i%6==0){
					if(i/6 != 63)
						particleGroup.emitters[i/6].position.value = particleGroup.emitters[i/6].position.value.copy( vA );
				}

				// rotate
				var m1 = new THREE.Matrix4();
				m1.lookAt( centerV, vA, upp );
				domeMorphTargets[i].mesh.quaternion.setFromRotationMatrix( m1 );
			}
		}
	// -------------------------- ANIM END ---------------------------------
};

var onWindowResize = function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
};

var animate = function () {

	requestAnimationFrame( animate );
	controls.update();
	// -------------------------- ANIM START -------------------------------
		UpdateAnim();
	// -------------------------- ANIM END ---------------------------------
	renderer.render( scene, camera );

};

init();
animate();

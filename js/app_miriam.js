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
var curveBehavior;

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
		curveBehavior = new function() {
			this.curveInfluence = 0.01;
			this.curveInfluence2 = 0.01;
			this.curveInfluence3 = 0.01;
			this.curveInfluence4 = 0.01;
			this.curveInfluence5 = 0.01;
			this.curveInfluence6 = 0.01;
			this.curveInfluenceTotal = 0.01;

			this.curveUpdate = function() {
				// v.1
					// manFigure.morphTargetInfluences[0] = curveBehavior.curveInfluence;
					// manFigure.morphTargetInfluences[1] = curveBehavior.curveInfluence2;
					// manFigure.morphTargetInfluences[2] = curveBehavior.curveInfluence3;
					// manFigure.morphTargetInfluences[3] = curveBehavior.curveInfluence4;
					// manFigure.morphTargetInfluences[4] = curveBehavior.curveInfluence5;
					// manFigure.morphTargetInfluences[5] = curveBehavior.curveInfluence6;

				// v.2
					if (curveBehavior.curveInfluenceTotal <= 1/13) {
						curveBehavior.curveInfluence = (curveBehavior.curveInfluenceTotal-0)*13;

						curveBehavior.curveInfluence2 = 0;
						curveBehavior.curveInfluence3 = 0;
						curveBehavior.curveInfluence4 = 0;
						curveBehavior.curveInfluence5 = 0;
						curveBehavior.curveInfluence6 = 0;
					} else if (curveBehavior.curveInfluenceTotal >= 2/13 && curveBehavior.curveInfluenceTotal <= 3/13) {
						curveBehavior.curveInfluence2 = (curveBehavior.curveInfluenceTotal-2/13)*13;
						curveBehavior.curveInfluence = 1 - (curveBehavior.curveInfluenceTotal-2/13)*13;

						curveBehavior.curveInfluence3 = 0;
						curveBehavior.curveInfluence4 = 0;
						curveBehavior.curveInfluence5 = 0;
						curveBehavior.curveInfluence6 = 0;
					} else if (curveBehavior.curveInfluenceTotal >= 4/13 && curveBehavior.curveInfluenceTotal <= 5/13) {
						curveBehavior.curveInfluence3 = (curveBehavior.curveInfluenceTotal-4/13)*13;
						curveBehavior.curveInfluence2 = 1 - (curveBehavior.curveInfluenceTotal-4/13)*13;					

						curveBehavior.curveInfluence = 0;
						curveBehavior.curveInfluence4 = 0;
						curveBehavior.curveInfluence5 = 0;
						curveBehavior.curveInfluence6 = 0;
					} else if (curveBehavior.curveInfluenceTotal >= 6/13 && curveBehavior.curveInfluenceTotal <= 7/13) {
						curveBehavior.curveInfluence4 = (curveBehavior.curveInfluenceTotal-6/13)*13;
						curveBehavior.curveInfluence3 = 1 - (curveBehavior.curveInfluenceTotal-6/13)*13;

						curveBehavior.curveInfluence = 0;
						curveBehavior.curveInfluence2 = 0;
						curveBehavior.curveInfluence5 = 0;
						curveBehavior.curveInfluence6 = 0;
					} else if (curveBehavior.curveInfluenceTotal >= 8/13 && curveBehavior.curveInfluenceTotal <= 9/13) {
						curveBehavior.curveInfluence5 = (curveBehavior.curveInfluenceTotal-8/13)*13;
						curveBehavior.curveInfluence4 = 1 - (curveBehavior.curveInfluenceTotal-8/13)*13;

						curveBehavior.curveInfluence = 0;
						curveBehavior.curveInfluence2 = 0;
						curveBehavior.curveInfluence3 = 0;
						curveBehavior.curveInfluence6 = 0;
					} else if (curveBehavior.curveInfluenceTotal >= 10/13 && curveBehavior.curveInfluenceTotal <= 11/13) {
						curveBehavior.curveInfluence6 = (curveBehavior.curveInfluenceTotal-10/13)*13;
						curveBehavior.curveInfluence5 = 1 - (curveBehavior.curveInfluenceTotal-10/13)*13;

						curveBehavior.curveInfluence = 0;
						curveBehavior.curveInfluence2 = 0;
						curveBehavior.curveInfluence3 = 0;
						curveBehavior.curveInfluence4 = 0;
					}

					UpdateInfluence();
			};
		// 	this.showTwig = function() {
		// 		for(var i=0; i<domeMorphTargets.length; i++){
		// 			TweenMax.to( domeMorphTargets[i].mesh.children[0].scale, 2, { x: 1, y: 1, z: 1 } );
		// 			TweenMax.to( domeMorphTargets[i].mesh.children[1].scale, 2, { x: 0.01, y: 0.01, z: 0.01 } );
		// 			TweenMax.to( domeMorphTargets[i].mesh.children[2].scale, 2, { x: 0.01, y: 0.01, z: 0.01 } );
		// 		}
		// 	};
		// 	this.showLeaf = function() {
		// 		for(var i=0; i<domeMorphTargets.length; i++){
		// 			TweenMax.to( domeMorphTargets[i].mesh.children[1].scale, 2, { x: 1, y: 1, z: 1, ease: Power2.easeOut } );
		// 			TweenMax.to( domeMorphTargets[i].mesh.children[0].scale, 2.5, { x: 0.01, y: 0.01, z: 0.01, ease: Power4.easeIn } );
		// 			TweenMax.to( domeMorphTargets[i].mesh.children[2].scale, 2.5, { x: 0.01, y: 0.01, z: 0.01, ease: Power4.easeIn } );
		// 		}
		// 	};
		// 	this.showEvil = function() {
		// 		for(var i=0; i<domeMorphTargets.length; i++){
		// 			TweenMax.to( domeMorphTargets[i].mesh.children[2].scale, 1.5, { x: 1, y: 1, z: 1 } );
		// 			TweenMax.to( domeMorphTargets[i].mesh.children[1].scale, 1.5, { x: 0.01, y: 0.01, z: 0.01 } );
		// 			TweenMax.to( domeMorphTargets[i].mesh.children[0].scale, 1.5, { x: 0.01, y: 0.01, z: 0.01 } );
		// 		}
		// 	};
		// 	this.toBrown = function() {
		// 		// 59.6, 35.3, 9
		// 		TweenMax.to( twigMat.color, 2, { r: 0.59, g: 0.35, b: 0.1 } );
		// 		TweenMax.to( leafMat.color, 2, { r: 0.59, g: 0.35, b: 0.1 } );
		// 		TweenMax.to( evilMat.color, 2, { r: 0.59, g: 0.35, b: 0.1 } );
		// 	};
		// 	this.toPurple = function() {
		// 		// 35.3, 9, 59.6
		// 		TweenMax.to( twigMat.color, 2, { r: 0.35, g: 0.1, b: 0.59 } );
		// 		TweenMax.to( leafMat.color, 2, { r: 0.35, g: 0.1, b: 0.59 } );
		// 		TweenMax.to( evilMat.color, 2, { r: 0.35, g: 0.1, b: 0.59 } );
		// 	};
		// 	this.toGreen = function() {
		// 		// 9, 59.6, 35.3
		// 		TweenMax.to( twigMat.color, 2, { r: 0.1, g: 0.59, b: 0.35 } );
		// 		TweenMax.to( leafMat.color, 2, { r: 0.1, g: 0.59, b: 0.35 } );
		// 		TweenMax.to( evilMat.color, 2, { r: 0.1, g: 0.59, b: 0.35 } );
		// 	};
		// 	this.toPink = function() {
		// 		// 87.8, 19.2, 52.9
		// 		TweenMax.to( twigMat.color, 2, { r: 0.88, g: 0.19, b: 0.53 } );
		// 		TweenMax.to( leafMat.color, 2, { r: 0.88, g: 0.19, b: 0.53 } );
		// 		TweenMax.to( evilMat.color, 2, { r: 0.88, g: 0.19, b: 0.53 } );
		// 	};
		}
		// gui.add(curveBehavior, 'curveInfluence', 0, 1).onChange(curveBehavior.curveUpdate);
		// gui.add(curveBehavior, 'curveInfluence2', 0, 1).onChange(curveBehavior.curveUpdate);
		// gui.add(curveBehavior, 'curveInfluence3', 0, 1).onChange(curveBehavior.curveUpdate);
		// gui.add(curveBehavior, 'curveInfluence4', 0, 1).onChange(curveBehavior.curveUpdate);
		// gui.add(curveBehavior, 'curveInfluence5', 0, 1).onChange(curveBehavior.curveUpdate);
		// gui.add(curveBehavior, 'curveInfluence6', 0, 1).onChange(curveBehavior.curveUpdate);
		gui.add(curveBehavior, 'curveInfluenceTotal', 0, 1).onChange(curveBehavior.curveUpdate);
		//
		SetupAnim();

		var lookupTable=[];
		for (var i=0; i<50; i++) {
		  lookupTable.push(Math.random());
		}

		function UpdateInfluence(){
			manFigure.morphTargetInfluences[0] = curveBehavior.curveInfluence;
			manFigure.morphTargetInfluences[1] = curveBehavior.curveInfluence2;
			manFigure.morphTargetInfluences[2] = curveBehavior.curveInfluence3;
			manFigure.morphTargetInfluences[3] = curveBehavior.curveInfluence4;
			manFigure.morphTargetInfluences[4] = curveBehavior.curveInfluence5;
			manFigure.morphTargetInfluences[5] = curveBehavior.curveInfluence6;

			console.log(  curveBehavior.curveInfluence + ", "
						+ curveBehavior.curveInfluence2 + ", "
						+ curveBehavior.curveInfluence3 + ", "
						+ curveBehavior.curveInfluence4 + ", "
						+ curveBehavior.curveInfluence5 + ", "
						+ curveBehavior.curveInfluence6);
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

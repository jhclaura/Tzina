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

var ray, projector, mouse, controls;
var videos, objects;
var clickCount;

var init = function () {

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 100000 );
	camera.position.set(-30,-8,-700);

	cameraTarget = new THREE.Vector3( 0, 0, - 1000 );

	scene = new THREE.Scene();
	scene.add( camera );

	controls = new THREE.OrbitControls(camera);

		video = new RGBDVideo( lupo_test_take[0] );
		video.rotation.set(0,135.09999999999997,0);
		video.position.x = -260;
		video.position.z = -1050;
		scene.add( video );


	renderer = new THREE.WebGLRenderer( { alpha: true } );
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
	var gui = new dat.GUI();
	var text = new tzina();
	gui.add(text, 'start');
	gui.add(text, 'stop');

	// -------------------------- ANIM START -------------------------------
		clickCount = 0;
		var lightBehavior = function() {
			this.chase = function() {
				lightToChase = true;
				clickCount = 0;
				for(var i=0; i<lightSource.length; i++){
					lightSource[i].setToChase(true);
				}
			},
			this.away = function() {
				lightToChase = false;
				clickCount = 0;
				for(var i=0; i<lightSource.length; i++){
					lightSource[i].setToChase(false);
				}
			},
			this.awayOneByOne = function() {
				lightToChase = false;

				if( clickCount<lightSource.length-1 ){
					lightSource[clickCount].setToChase(false);
					clickCount++;
					console.log(lightSource[clickCount].toChase);
				}
			}
		}
		var aniText = new lightBehavior();
		gui.add(aniText, 'chase');
		gui.add(aniText, 'away');
		gui.add(aniText, 'awayOneByOne');
		SetupAnim();
	// -------------------------- ANIM END ---------------------------------
};

var onWindowResize = function () {

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

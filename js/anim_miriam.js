// Animation v4 - Clean up

// GENERAL
	var clock;
// PARTICLES
	var emitter, particleGroup;
	var counter, particleTex;
	var dandelionMat; dandelionAmount = 7;
	var videoCh = new THREE.Object3D();
	var hannahHouse, hannahHouseMat;
	var hannahRoom, hannahRoomMat;
	var hannahRoomFiles = ["assets/models/hannah_room/hr_bookshelf.js", "assets/models/hannah_room/hr_chair.js",
						   "assets/models/hannah_room/hr_door.js", "assets/models/hannah_room/hr_fireplace.js",
						   "assets/models/hannah_room/hr_photo1.js", "assets/models/hannah_room/hr_photo2.js",
						   "assets/models/hannah_room/hr_photo3.js", "assets/models/hannah_room/hr_photo4.js",
						   "assets/models/hannah_room/hr_photo5.js", "assets/models/hannah_room/hr_room2.js",
						   "assets/models/hannah_room/hr_shelf.js", "assets/models/hannah_room/hr_sidewall.js",
						   "assets/models/hannah_room/hr_sofa.js", "assets/models/hannah_room/hr_sofa2.js",
						   "assets/models/hannah_room/hr_table.js", "assets/models/hannah_room/hr_window.js"];

// LIGHT
	var bulbGeo, bulbAmount=10, textGlow, lightSource=[];
	var bulbChaseStrength, bulbAwayStrength;
	var bulbChaseStrengthes=[], bulbAwayStrengthes=[];
	var lightToChase = true;

	LauraMath = function(x) {
		this.x = x || 0;
	}

	LauraMath.prototype = {

		constructor: LauraMath,

		lerpValue: function (end, amount) {
			this.x += ((end - this.x) * amount);
			return this.x;
		}
	}

//CLOCK
	var swingClockGeo, swingClockTex, swingClockMat, swingClock;
	var GFClock, GFClockTex, GFClockMat, GFClockGeo;
	var myClock = new THREE.Object3D();
	var cGear;
	var myGear = new THREE.Object3D(), myCP1 = new THREE.Object3D(), myCP2 = new THREE.Object3D();
	var grandFatherClock = new THREE.Object3D();

	var startSwing = true;
	var swingStep = 5;

	var BGColor = new THREE.Color(0,0,0);

// MAN_FIGURE
	var men_figures_vec = {}, men_figures_points=[];
	var manFigure, manFigureGeo;


function SetupAnim() {

	clock = new THREE.Clock();

	var p_tex_loader = new THREE.TextureLoader();
	// particleTex = p_tex_loader.load('assets/images/dandelion_particle.jpg');

	var loader = new THREE.JSONLoader();
	// loader.load("assets/models/spike_curvey.js", function(geometry, material){
	// 	evilGeo = geometry;
	// });

	hannahRoom = new THREE.Object3D();
	// for(var i=0; i<hannahRoomFiles.length; i++){
	// 	loader.load( hannahRoomFiles[i], function(geometry){
	// 		var colorValue = Math.random() * 0xFF | 0;
	// 		var colorString = "rgb("+colorValue+","+colorValue+","+colorValue+")";
	// 		// mat = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
	// 		mat = new THREE.MeshLambertMaterial({ color: colorString });
	// 		meshhh = new THREE.Mesh(geometry, mat);
	// 		hannahRoom.add(meshhh);
	// 	});
	// }
	// hannahRoom.scale.set(8,8,8);
	// hannahRoom.rotation.y = Math.PI;
	// hannahRoom.position.y = 400;
	// scene.add(hannahRoom);

	// ORGANIZE THE DATA
		var m_f_size = Object.keys(men_figures).length;
		for(var i=1; i<=m_f_size; i++) {
			men_figures_vec[i] = [];

			for(var j=0; j<men_figures[i].length; j++){
				var newVector = new THREE.Vector3( Number(men_figures[i][j][0]),
												   Number(men_figures[i][j][1]),
												   Number(men_figures[i][j][2]) );
				// console.log( Number(men_figures[i][j][0]) );
				men_figures_vec[i].push( newVector );
			}
		}

	// CREATE CURVE
		// v.1 - FAILED
			// var manGeometry = new THREE.Geometry();
			// var manSpline = new THREE.Spline( men_figures_vec[1] );

			// for (var i=0; i<men_figures_vec[1].lenght; i++) {
			// 	manGeometry.vertices.push( new THREE.Vector3( men_figures_vec[1][i].x,
			// 												  men_figures_vec[1][i].y,
			// 												  men_figures_vec[1][i].z ) );
			// 	// manGeometry.vertices[i] = new THREE.Vector3( men_figures_vec[1][i].x,
			// 	// 											 men_figures_vec[1][i].y,
			// 	// 											 men_figures_vec[1][i].z );

			// }

			// var manMaterial = new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 1, linewidth: 3 } );
			// var manLine = new THREE.Line( manGeometry.clone(), manMaterial );
			// scene.add(manLine);

		// v.2
			var manMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.7, linewidth: 3, vertexColors: THREE.VertexColors } );
			var manMaterial2 = new THREE.MeshLambertMaterial({
					color: 0xff0000, morphTargets: true
				});
			var m_f_size = Object.keys(men_figures_vec).length;

			for(var i=1; i<=m_f_size; i++) {
				var manSpline = new THREE.CatmullRomCurve3( men_figures_vec[i] );
				manSpline.type = 'catmullrom';
				manSpline.closed = true;
				// var manCurve = manSpline.getPoints( 50 );
				men_figures_points.push(manSpline);
			}
			// var manSpline = new THREE.CatmullRomCurve3( men_figures_vec[7] );
			// manSpline.type = 'catmullrom';
			// manSpline.closed = true;
			// var manCurve = manSpline.getPoints( 80 );

			var curveColors = [];
			for(var i=0; i<men_figures_points[1].length; i++){
				curveColors[ i ] = new THREE.Color( 0xffffff );
				var colorValue = (men_figures_points[1][i].y / 50);
				// console.log( colorValue );
				curveColors[ i ].setHSL( 0.9, 1.0, Math.max( 0, colorValue ) + 0.5 );
			}

			// var manGeometry = new THREE.Geometry();
			// // manGeometry.vertices = men_figures_vec[1];
			// manGeometry.vertices = men_figures_points[0];
			// manGeometry.colors = curveColors;

			// manFigure = new THREE.Line( manGeometry, manMaterial );
			manGeometry = new THREE.TubeGeometry( men_figures_points[0], 100, 0.1, 3, true);
			for(var i=1; i<men_figures_points.length; i++){
				manGeometry2 = new THREE.TubeGeometry( men_figures_points[i], 100, 0.1, 3, true);
				var nameee = 't'+(i-1);
				manGeometry.morphTargets[i-1] = {name: nameee, vertices: manGeometry2.vertices};
			}
			
			// var manGeometry2 = new THREE.TubeGeometry( men_figures_points[1], 100, 0.1, 3, true);
			// var manGeometry3 = new THREE.TubeGeometry( men_figures_points[2], 100, 0.1, 3, true);
			// manGeometry.morphTargets[0] = {name: 't1', vertices: manGeometry2.vertices};
			// manGeometry.morphTargets[1] = {name: 't2', vertices: manGeometry3.vertices};
			manGeometry.computeMorphNormals();

			manFigure = new THREE.Mesh(manGeometry, manMaterial2);
			// manFigure = new THREE.Mesh( manGeometry, manMaterial2 );
			manFigure.scale.set(80,80,80);
			manFigure.rotation.y = Math.PI;
			manFigure.position.set(0,0,200);
			scene.add( manFigure );


			// manFigure.animation = [ [0,1], [100,0.166], [200,-0.377], [300,-1], [400,1], [500,0.166], [600,-0.377] ];
			// manFigure.inPoint = manFigure.animation[0][0];
			// manFigure.outPoint = manFigure.animation[manFigure.animation.length-1][0];
			// manFigure.update = function (time) {
			// 	if(time > manFigure.inPoint && time < manFigure.outPoint){
			// 		var getLerp = FindInOut(time, manFigure.animation);

			// 		var value = Remap(
			// 			getLerp[0],0,1,
			// 			manFigure.animation[getLerp[1]][1],
			// 			manFigure.animation[getLerp[2]][1] );

			// 		console.log(value);
			// 	}
			// }

	// CREATE CURVE MAN


	function InitParticles_v2() {

		particleGroup = new SPE.Group({
			texture: {
				value: particleTex
			},
			depthTest: false
		});

		// reduce emitter amount to be 1/5 of domeMorphTargets.length
		for(var i=0; i<domeMorphTargets.length-6; i+=6){
			emitter = new SPE.Emitter({
				type: SPE.distributions.SPHERE,
				// duration: 10,
				maxAge: {
					value: 10,
					spread: 2
				},
				position: {
					// value: domeMorphTargets[i].position,
					value: domeMorphTargets[i].mesh.position,
					spread: new THREE.Vector3(20,20,20),
					radiusScale: new THREE.Vector3(3,3,3),
					distribution: SPE.distributions.SPHERE
				},
				acceleration: {
					value: new THREE.Vector3(0,-5,0),
					spread: new THREE.Vector3(2,-5,2)
				},
				velocity: {
					value: new THREE.Vector3(1,-1,1)
					// distribution: SPE.distributions.SPHERE
				},
				rotation: {
					angle: 1
				},
				angle: {
					value: [0,1,-1],
					spread: [0,-1,1]
				},
				// color: {
				// 	value: new THREE.Color( 0xAA4488 )
				// },
				opacity: {
					value: [0,1,1,1,0]
				},
				size: {
					value: [10,50,50,50,30]
					// spread: [1,3]
				},
				particleCount: 40,
				drag: 0.5
				// wiggle: 15
				// isStatic: true
			});
			particleGroup.addEmitter( emitter );
		}
		scene.add( particleGroup.mesh );
	}

	function loadModel (model, modelMat, modelPos, modelScale, returnMesh ) {

		var loader = new THREE.JSONLoader();
		var _modelMat;

		loader.load(model, function(geometry, material){

			if( modelMat == null) {
				_modelMat = new THREE.MeshBasicMaterial();
			} else {
				_modelMat = modelMat;
			}
			var returnM = new THREE.Mesh(geometry, _modelMat);
			returnM.scale.multiplyScalar(modelScale);
			returnM.position.copy(modelPos);

			scene.add(returnM);

			returnMesh(returnM);
		});
	}

	function loadModelRig (model, modelTex, modelPos, modelScale, returnMesh) {

		var loader = new THREE.JSONLoader();
		var returnRig;
		// var slpMat = meshMat;

		loader.load(model, function(geometry, material){

			// console.log(material);
			var myMat = new THREE.MeshBasicMaterial({
				skinning: true,
				map: modelTex,
				side: THREE.DoubleSide,
				alphaTest: 0.5
			});
			
			var returnRig = new THREE.SkinnedMesh(geometry, myMat);

			returnRig.scale.multiplyScalar(modelScale);
			returnRig.position.copy(modelPos);
			scene.add(returnRig);

			returnMesh(returnRig);
		});
	}

}

function UpdateAnim() {
	var dt = clock.getDelta ();
	var et = clock.getElapsedTime ();

	// if(particleGroup)
	// 	particleGroup.tick( dt );
}


// function built based on Stemkoski's
// http://stemkoski.github.io/Three.js/Texture-Animation.html
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration, order) 
{	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;

	// order of the pic
	this.displayOrder = order;

		
	this.updateLaura = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			var currentColumn = this.displayOrder[ this.currentTile ] % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.displayOrder[ this.currentTile ] / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;

			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;

			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;

			// console.log(this.displayOrder[ this.currentTile ]);
		}
	};

	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;

			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;


			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;

			console.log('currentTile: ' + this.currentTile + ', offset.x: ' + texture.offset.x);
		}
	};
}
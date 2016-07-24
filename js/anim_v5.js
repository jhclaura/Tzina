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

// MEN
	var doodleMenTexFiles = ["assets/images/doodleMen1.png", "assets/images/doodleMen2.png", "assets/images/doodleMen3.png"];
	var doodleMenTex = [], doodleMen = [], doodleMenAnimators = [];

// DOME
	var dome, domeGeo, shield, shieldGeo, collapseGeo;
	var domeMorphTargets = [];
	var twigGeo, leafGeo, evilGeo, twigMat, leafMat, evilMat, evilTex;
	var displacement_t, color_t, uniforms_t, shaderMat_t, nv_t;
	var perlin = new ImprovedNoise(), noiseQuality = 1;
	var hannahDomeBuilt = false;
	var upp = new THREE.Vector3(0,-1,0);

	var sequenceConfig = [
		{time: 4000, anim: BeDome, seqStartTime: -1, performed: false},
		{time: 10000, anim: ShowLeaf, seqStartTime: -1, performed: false},
		{time: 16000, anim: BeCollapse, seqStartTime: -1, performed: false}
	];

	var lookupTable=[];


function BeDome(el_time){
	var influence = el_time/4000;
	// console.log("dome influence: " + influence);
	if(influence<=1){
		dome.morphTargetInfluences[0] = influence;
		UpdateVertices();
	}else{
		dome.morphTargetInfluences[0] = 1;
		UpdateVertices();
		sequenceConfig[0].performed=true;
	}
}

function ShowLeaf(){
	for(var i=0; i<domeMorphTargets.length; i++){
		TweenMax.to( domeMorphTargets[i].mesh.children[1].scale, 2, { x: 1, y: 1, z: 1, ease: Power2.easeOut } );
		// TweenMax.to( domeMorphTargets[i].mesh.children[0].scale, 3, { x: 0.01, y: 0.01, z: 0.01, ease: Power4.easeIn } );
		TweenMax.to( domeMorphTargets[i].mesh.children[2].scale, 3, { x: 0.01, y: 0.01, z: 0.01, ease: Power4.easeIn } );
	}
	sequenceConfig[1].performed=true;
}

function BeCollapse(el_time){
	var influence = el_time/4000;
	console.log("collapseGeo influence: " + influence);
	if(influence<=1){
		dome.morphTargetInfluences[1] = influence;
		dome.morphTargetInfluences[0] = 1-influence;
		UpdateVertices();
	}else{
		dome.morphTargetInfluences[1] = 1;
		dome.morphTargetInfluences[0] = 0;
		UpdateVertices();
		sequenceConfig[2].performed=true;
	}
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

function SetupAnim() {

	clock = new THREE.Clock();

	var p_tex_loader = new THREE.TextureLoader();
	particleTex = p_tex_loader.load('assets/images/dandelion_particle.jpg');
	evilTex = p_tex_loader.load('assets/images/spike3.jpg');

	//
	videoCh.position.copy( videoPosition );
	videoCh.position.y = 300;
	bulbChaseStrength = new LauraMath(0);
	bulbAwayStrength = new LauraMath(0.5);
	
	loadModelDome('assets/models/shield.js', 'assets/models/dome.js', 'assets/models/collapse.js');

	var loader = new THREE.JSONLoader();
	loader.load("assets/models/spike_curvey.js", function(geometry, material){
		evilGeo = geometry;
	});
	loader.load("assets/models/leavesss_less.js", function(geometry, material){
		leafGeo = geometry;

		// ref: https://stemkoski.github.io/Three.js/Vertex-Colors.html
		var face, numberOfSides, vertexIndex, point, color;
		var faceIndices = [ 'a', 'b', 'c', 'd' ];
		// vertex color
		for(var i=0; i<leafGeo.faces.length; i++)
		{
			face = leafGeo.faces[i];
			numberOfSides = (face instanceof THREE.Face3 ) ? 3 : 4;
			// assign color to each vertex of current face
			for(var j=0; j<numberOfSides; j++)
			{
				vertexIndex = face[ faceIndices[j] ];
				//store coordinates of vertex
				point = leafGeo.vertices[ vertexIndex ];
				// initialize color variable
				color = new THREE.Color();
				color.setRGB( 0.1 + (10+point.x) / ((j+4)*5), 0.5 + (10+point.y) / ((j+4)*15), 0.2 + (10+point.z) / ((j+4)*5) );
				face.vertexColors[j] = color;
			}
		}
	});

	loader.load("assets/models/twig.js", function(geometry, material){
		twigGeo = geometry;
	});

	hannahRoom = new THREE.Object3D();

	// DOODLE_MEN
	var menGeometry = new THREE.PlaneGeometry( 5, 10 );
	for(var i=0; i<doodleMenTexFiles.length; i++){
		var mTex = p_tex_loader.load( doodleMenTexFiles[i] );
	
		var mAni = new TextureAnimator( mTex, 2, 1, 2, 60, [0,1] );
		doodleMenAnimators.push(mAni);

		var mMat = new THREE.MeshBasicMaterial( {map: mTex, side: THREE.DoubleSide, transparent: true} );
		var mMesh = new THREE.Mesh( menGeometry, mMat );
		mMesh.position.x = -15-i*6;
		mMesh.position.y = 7.5;
		hannahRoom.add(mMesh);
		doodleMen.push(mMesh);
	}

	for(var i=0; i<hannahRoomFiles.length; i++){
		loader.load( hannahRoomFiles[i], function(geometry){
			var colorValue = Math.random() * 0xFF | 0;
			var colorString = "rgb("+colorValue+","+colorValue+","+colorValue+")";
			// mat = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
			mat = new THREE.MeshLambertMaterial({ color: colorString });
			meshhh = new THREE.Mesh(geometry, mat);
			hannahRoom.add(meshhh);
		});
	}
	hannahRoom.scale.set(8,8,8);
	hannahRoom.rotation.y = Math.PI;
	hannahRoom.position.y = 400;
	scene.add(hannahRoom);


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

	function loadModelDome (modelS, modelD, modelC) {

		var loader = new THREE.JSONLoader();
		var domeMat = new THREE.MeshBasicMaterial({morphTargets: true, color: 0xAA4488, wireframe: true, visible: false});
		var followMat = new THREE.MeshBasicMaterial({color: 0xffff00});
		var followMesh = new THREE.Mesh(new THREE.SphereGeometry(10), followMat);

		// leafMat = new THREE.MeshBasicMaterial( {color: 0x17985a, wireframe: true} );
		leafMat = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors, wireframe: true } );

		twigMat = new THREE.MeshBasicMaterial( {color: 0x985a17, wireframe: true} );

		// evilMat = new THREE.MeshLambertMaterial( {color: 0x5a1798} );
		evilTex.wrapS = THREE.RepeatWrapping;
		evilTex.wrapT = THREE.RepeatWrapping;
		evilTex.repeat.set( 1, 4 );
		evilMat = new THREE.MeshLambertMaterial( {map: evilTex} );

		loader.load(modelS, function(geometry, material){

			shieldGeo = geometry;
			
			loader.load(modelD, function(geometryD, materialD){
				domeGeo = geometryD;

				loader.load(modelC, function(geometryC, materialC){
					collapseGeo = geometryC;

					var tempDome = new THREE.Mesh(domeGeo, followMat);
					tempDome.rotation.y = Math.PI;
					tempDome.scale.multiplyScalar(90);
					tempDome.updateMatrix();

					domeGeo.applyMatrix( tempDome.matrix );
					shieldGeo.applyMatrix( tempDome.matrix );
					collapseGeo.applyMatrix( tempDome.matrix );

					shieldGeo.morphTargets[0] = {name: 't1', vertices: domeGeo.vertices};
					shieldGeo.morphTargets[1] = {name: 't2', vertices: collapseGeo.vertices};
					shieldGeo.computeMorphNormals();

					dome = new THREE.Mesh(shieldGeo, domeMat);

					var centerV = new THREE.Vector3();

					for(var i=0; i<dome.geometry.vertices.length; i++){
						// v.1 - yellow ball
						// var fMesh = followMesh.clone();
						// fMesh.position.copy( dome.geometry.vertices[i] );
						// scene.add(fMesh)

						// v.2 - thing
						var fMesh = new Thing( dome.geometry.vertices[i],
											   twigGeo, leafGeo, evilGeo,
											   twigMat, leafMat, evilMat );

						var m1 = new THREE.Matrix4();
						m1.lookAt( centerV, dome.geometry.vertices[i], upp );
						fMesh.mesh.quaternion.setFromRotationMatrix( m1 );

						domeMorphTargets.push( fMesh );
					}
					scene.add(dome);

					InitParticles_v2();

					hannahDomeBuilt = true;

					UpdateVertices ();
				});
			});
			
		});
	}

	//
	// StartSequence();
	for (var i=0; i<50; i++) {
	  lookupTable.push(Math.random());
	}
}

var animStart = false, animStartTime=0, animTime=0, animRandom=true;

function StartSequence () {
	animStart = true;
	animStartTime = clock.getElapsedTime ()*1000;
}

function UpdateAnim() {
	var dt = clock.getDelta ();
	var et = clock.getElapsedTime ();

	if(particleGroup)
		particleGroup.tick( dt );

	// start animation sequence
		if(hannahDomeBuilt && !animStart){
			StartSequence();
		}

		if(animStart){
			animTime = et*1000-animStartTime;

			for(var i=0; i<sequenceConfig.length; i++){

				if(animTime >= sequenceConfig[i].time && !sequenceConfig[i].performed){
					if(sequenceConfig[i].seqStartTime<0)
						sequenceConfig[i].seqStartTime = animTime;

					sequenceConfig[i].anim( animTime-sequenceConfig[i].seqStartTime );
					// console.log("do animation #: " + i);
				}
			}
		}

	//
	if(hannahDomeBuilt && animRandom){
		for(var i=0; i<shieldGeo.vertices.length; i++){
			// var h =  perlin.noise(et*0.001, i, 1) % (Math.PI/2);
			var h = perlin.noise(et*0.1, i, 1)/2;
			domeMorphTargets[i].mesh.position.addScalar( h );

			if( i%6==0 ){
				if(i/6 != 63)
					particleGroup.emitters[i/6].position.value = particleGroup.emitters[i/6].position.value.addScalar( h );
			}
		}
	}

	// DOODLE_MEN
	if(doodleMenAnimators.length>0){
		for(var i=0; i<doodleMenAnimators.length; i++){
			doodleMenAnimators[i].updateLaura( 300*dt );
		}
	}
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
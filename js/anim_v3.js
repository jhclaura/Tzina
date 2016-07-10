// GENERAL
	var clock;
// PARTICLES
	var emitter, particleGroup;
	var counter, particleTex;
	var dandelionMat; dandelionAmount = 7;
	var videoCh = new THREE.Object3D();
	var hannahHouse, hannahHouseMat;

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

// MAN
	var manTex1, manTex2, manTex3;
	var manRig1, manBone1, manRig2, manBone2, manRig3, manBone3;

// DOME
	var dome, domeGeo, shield, shieldGeo, collapseGeo;
	var domeMorphTargets = [];
	var twigGeo, leafGeo, evilGeo, twigMat, leafMat, evilMat;
	var displacement_t, color_t, uniforms_t, shaderMat_t, nv_t;
	var perlin = new ImprovedNoise(), noiseQuality = 1;
	var hannahDomeBuilt = false;
	var upp = new THREE.Vector3(0,-1,0);

function SetupAnim() {

	clock = new THREE.Clock();

	var p_tex_loader = new THREE.TextureLoader();
	p_tex_loader.load('assets/images/dandelion_particle.jpg', function(tex){
	 	particleTex = tex;
	});

	hannahHouseMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});

	//
	videoCh.position.copy( videoPosition );
	videoCh.position.y = 300;
	bulbChaseStrength = new LauraMath(0);
	bulbAwayStrength = new LauraMath(0.5);
	
    textGlow = p_tex_loader.load('assets/images/glow_edit.png');

	//
	manTex1 = p_tex_loader.load('assets/images/man1.png');
	manTex2 = p_tex_loader.load('assets/images/man2.png');
	manTex3 = p_tex_loader.load('assets/images/man3.png');

	// loadModelRig('assets/models/man1.js', manTex1, videoCh.position, 50, function(returnMesh){
	// 	manRig1 = returnMesh;
	// 	manBone1 = manRig1.skeleton.bones;
	// 	manBone1[1].rotation.y = -0.2;
	// 	new TWEEN.Tween(manBone1[1].rotation)
	// 				  .to({y: 0.2}, 1000)
	// 				  .repeat(Infinity)
	// 				  .yoyo(true)
	// 				  // .easing(TWEEN.Easing.Elastic.InOut)
	// 				  .start();

	// 	manRig2 = manRig1.clone();
	// 	manRig2.position.x += 80;
	// 	manRig2.material = manRig2.material.clone();
	// 	manRig2.material.map = manTex2;
	// 	scene.add(manRig2);
	// 	manBone2 = manRig2.skeleton.bones;
	// 	manBone2[1].rotation.y = -0.2;
	// 	new TWEEN.Tween(manBone2[1].rotation)
	// 				  .to({y: 0.2}, 1000)
	// 				  .repeat(Infinity)
	// 				  .yoyo(true)
	// 				  .start();

	// 	manRig3 = manRig1.clone();
	// 	manRig3.position.x -= 80;
	// 	manRig3.material = manRig3.material.clone();
	// 	manRig3.material.map = manTex3;
	// 	scene.add(manRig3);
	// 	manBone3 = manRig3.skeleton.bones;
	// 	manBone3[1].rotation.y = -0.2;
	// 	new TWEEN.Tween(manBone3[1].rotation)
	// 				  .to({y: 0.2}, 1000)
	// 				  .repeat(Infinity)
	// 				  .yoyo(true)
	// 				  .start();
	// });

	loadModelDome('assets/models/shield.js', 'assets/models/dome.js', 'assets/models/collapse.js');

	var loader = new THREE.JSONLoader();
	loader.load("assets/models/evil.js", function(geometry, material){
		evilGeo = geometry;
	});
	loader.load("assets/models/leaf.js", function(geometry, material){
		leafGeo = geometry;
	});
	loader.load("assets/models/twig.js", function(geometry, material){
		twigGeo = geometry;
	});

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

		leafMat = new THREE.MeshBasicMaterial( {color: 0x17985a, wireframe: true} );
		twigMat = new THREE.MeshBasicMaterial( {color: 0x985a17, wireframe: true} );
		evilMat = new THREE.MeshLambertMaterial( {color: 0x5a1798} );

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
				});
			});
			
		});
	}
}

function UpdateAnim() {
	var dt = clock.getDelta ();
	var et = clock.getElapsedTime ();

	if(particleGroup)
		particleGroup.tick( dt );

	TWEEN.update();

	//
	if(hannahDomeBuilt){
		for(var i=0; i<shieldGeo.vertices.length; i++){
			// var h =  perlin.noise(et*0.001, i, 1) % (Math.PI/2);
			var h = perlin.noise(et*0.1, i, 1);
			domeMorphTargets[i].mesh.position.addScalar( h );

			if( i%6==0 ){
				if(i/6 != 63)
					particleGroup.emitters[i/6].position.value = particleGroup.emitters[i/6].position.value.addScalar( h );
			}
		}
	}
	
}
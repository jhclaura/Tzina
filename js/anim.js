// GENERAL
	var clock;
// PARTICLES
	var emitter, particleGroup;
	var counter, particleTex;
	var dandelionMat; dandelionAmount = 7;
	var videoCh = new THREE.Object3D();
	var videoPosition = new THREE.Vector3(200,300,1300);

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

function SetupAnim() {

	clock = new THREE.Clock();

	var p_tex_loader = new THREE.TextureLoader();
	p_tex_loader.load('assets/images/blue_particle.jpg', function(tex){
	 	particleTex = tex;
		// InitParticles();
	});

	//
	videoCh.position.copy( videoPosition );
	bulbChaseStrength = new LauraMath(0);
	bulbAwayStrength = new LauraMath(0.5);
	
	// bulbGeo = new THREE.SphereGeometry(1, 32, 32);
    textGlow = p_tex_loader.load('assets/images/glow_edit.png');

	for(var i=0; i<bulbAmount; i++){

		var ranX = videoPosition.x + Math.floor( Math.random() * 200 - 100 ) * 2;
		var ranY = videoPosition.y + Math.floor( Math.random() * 100 );
		var ranZ = videoPosition.z + Math.floor( Math.random() * 200 - 100 ) * 2;

		L = new LightBulb(ranX,ranY,ranZ,textGlow);
		lightSource.push(L);

		LighthaseStrength = new LauraMath(0);
		LightAwayStrength = new LauraMath(0.5);
		bulbChaseStrengthes.push(LighthaseStrength);
		bulbAwayStrengthes.push(LightAwayStrength);
	}

	function InitParticles() {

		particleGroup = new SPE.Group({
			texture: {
				value: particleTex
			},
			depthTest: false
		});

		for(var i=0; i<dandelionAmount; i++){
			for(var j=0; j<dandelionAmount; j++){
				emitter = new SPE.Emitter({
					type: SPE.distributions.SPHERE,
					maxAge: {
						value: 2
					},
					position: {
						value: new THREE.Vector3( videoPosition.x+(i-3)*200,  videoPosition.y,  videoPosition.z+(j-3)*200 ),
						spread: new THREE.Vector3(20,20,20),
						radiusScale: new THREE.Vector3(3,3,3)
					},
					// acceleration: {
					// 	value: new THREE.Vector3(0,-10,0),
					// 	spread: new THREE.Vector3(10,0,10)
					// },
					velocity: {
						value: new THREE.Vector3(1,1,1),
						distribution: SPE.distributions.SPHERE
					},
					color: {
						value: new THREE.Color( 0xAA4488 )
					},
					size: {
						value: 50
						// spread: [1,3]
					},
					particleCount: 50,
					drag: 1
					// isStatic: true
				});
				particleGroup.addEmitter( emitter );
			}
			scene.add( particleGroup.mesh );
		}
	}
}

function UpdateAnim() {
	var dt = clock.getDelta();

	if(particleGroup)
		particleGroup.tick( dt );

	//
	// if( lightToChase ) {
	// 	// console.log([i] + "bulb chases!");
	// 	bulbChaseStrength.lerpValue(10, 0.1);
	// 	bulbAwayStrength.lerpValue(0, 0.1);
	// } else {
	// 	// console.log([i] + "bulb away!");
	// 	bulbChaseStrength.lerpValue(0, 0.01);
	// 	bulbAwayStrength.lerpValue(5, 0.001);
	// }

	for(var i=0; i<lightSource.length; i++){
		// lightSource[i].seek(pointerControls);
		// lightSource[i].arrive(pointerControls);

		if( lightToChase ) {
			// console.log([i] + "bulb chases!");
			bulbChaseStrengthes[i].lerpValue(10, 0.1);
			bulbAwayStrengthes[i].lerpValue(0, 0.1);
		} else {
			if(!lightSource[i].toChase){
				bulbChaseStrengthes[i].lerpValue(0, 0.01);
				bulbAwayStrengthes[i].lerpValue(5, 0.001);
			}
		}

		lightSource[i].separate(lightSource);

		lightSource[i].setArriveScalar(bulbChaseStrengthes[i].x);
		lightSource[i].setSeparateSingleScalar(bulbAwayStrengthes[i].x);

		lightSource[i].arrive( videoCh );
		lightSource[i].separateSingle( videoCh, 300 );

		// lightSource[i].align(lightSource);
		// lightSource[i].cohesion(lightSource);
		// lightSource[i].separateFromFloor(ground);
		lightSource[i].update();
		// lightSource[i].borders(3000, 1000);
	}
}
// Adapted from --> The Nature of Code, by Daniel Shiffman
// http://natureofcode.com


function Creature(x,y,z,type){
	this.position = new THREE.Vector3(x, y, z);
	this.acceleration = new THREE.Vector3(0,0,0);
	this.velocity = new THREE.Vector3(0,0,0);

	this.r = 0.6;
	this.maxSpeed = 0.3;
	this.maxForce = 0.0012;
	this.maxForceSelf = 0.0001;
	//this.texture = texture;

	//this.spaceLimit = 100;

	this.neighbordist = 10;

	this.separateSingleScalar = 0.1;
	this.arriveScalar = 2;

	//CREATE_CREATURE
	this.shapeType = type;

	if(this.shapeType==0){
	    this.geo = new THREE.SphereGeometry(0.5);
	    this.mat = new THREE.MeshBasicMaterial( {color: 0xff0000, transparent: true, opacity: 0} );
	} else if(this.shapeType==1){
		this.maxForce = 0.01;

	    this.geo = new THREE.TetrahedronGeometry(1);
	    this.mat = new THREE.MeshLambertMaterial({color: 0xffffff, shading: THREE.FlatShading});
	}
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.mesh.position.copy(this.position);
	scene.add(this.mesh);
}

/*
Creature.prototype.flock = function(lightbulbs) {
	var sep = this.separate(lightbulbs);
	var ali = this.align(lightbulbs);
	var coh = this.cohesion(lightbulbs);

	sep.multiplyScalar(1.5);
	ali.multiplyScalar(1.0);
	coh.multiplyScalar(1.0);

	this.applyForce(sep);
	this.applyForce(ali);
	this.applyForce(coh);
}
*/

Creature.prototype.update = function(){
	this.velocity.add(this.acceleration);
	this.velocity.clampScalar(-5, 5);
	this.position.add(this.velocity);
	this.acceleration.multiplyScalar(0);

	// var m1 = new THREE.Matrix4();
	// var mRot = m1.makeRotationFromEuler(velocity);

	this.mesh.position.copy(this.position);

	// this.mesh.rotation.copy(this.velocity);
}

Creature.prototype.applyForce = function(force){
	this.acceleration.add(force);
}

Creature.prototype.borders = function(spaceLimit, floor){
	if (this.position.x < -spaceLimit)  this.position.x = spaceLimit;
	if (this.position.z < -spaceLimit)  this.position.z = spaceLimit;
	if (this.position.x > spaceLimit) this.position.x = -spaceLimit;
	if (this.position.z > spaceLimit) this.position.z = -spaceLimit;

	if (this.position.y < floor) this.position.y = floor;
}

Creature.prototype.separate = function(creatures) {

	var desiredseparation = this.r*2;
	var sum = new THREE.Vector3();
	var count = 0;

	var diff = new THREE.Vector3();
	var steer = new THREE.Vector3();

	// check if they're too close
	for(var i=0; i<creatures.length; i++){
		var d = this.position.distanceTo(creatures[i].position);
		if( (d>0) && (d<desiredseparation) ){
			diff.subVectors(this.position, creatures[i].position);
			diff.normalize();
			diff.divideScalar(d);
			sum.add(diff);
			count++;
		}
	}

	// average
	if(count>0){
		sum.divideScalar(count);
	}
	if(sum.length() > 0){
		sum.normalize();
		sum.multiplyScalar(this.maxSpeed);

		steer.subVectors(sum, this.velocity);
		steer.clampScalar(-500, this.maxForceSelf);

		// increase intensity
		// steer.multiplyScalar(1.5);

		this.applyForce(steer);
	}
}

Creature.prototype.separateSingle = function(objectPos) {

	var desiredseparation;
	if(this.shapeType == 0)
		desiredseparation = this.r*40;
	if(this.shapeType == 1)
		desiredseparation = this.r*5;

	var sum = new THREE.Vector3();
	var count = 0;

	var diff = new THREE.Vector3();
	var steer = new THREE.Vector3();

	// check if they're too close
	var d = this.position.distanceToSquared(objectPos);
	
	if( (d<(desiredseparation*desiredseparation)) ){
		diff.subVectors(this.position, objectPos);
		diff.normalize();
	}

	diff.normalize();
	diff.multiplyScalar(this.maxSpeed);

	steer.subVectors(diff, this.velocity);
	steer.clampScalar(-500, this.maxForceSelf);

	steer.multiplyScalar(this.separateSingleScalar);

	this.applyForce(steer);

}

// Creature.prototype.separateFromFloor = function(floor) {

// 	var desiredseparation = this.r*6;

// 	var diff = new THREE.Vector3();
// 	var steer = new THREE.Vector3();

// 	// check if they're too close
// 	var d = this.position.y - floor.position.y;
// 	if( (d<desiredseparation) ){
// 		// diff.subVectors(this.position, floor.position);
// 		// diff.x = 0;
// 		// diff.z = 0;
// 		// diff.normalize();
// 		// diff.divideScalar(d);

// 		steer.y = 0.03;
// 	}

// 	// diff.normalize();
// 	// diff.multiplyScalar(this.maxSpeed);

// 	// steer.subVectors(diff, this.velocity);
// 	// steer.clampScalar(-500, this.maxForceSelf);

// 	// increase intensity
// 	// steer.multiplyScalar(15.0);

// 	this.applyForce(steer);
// }

Creature.prototype.seek = function(target){
	var desired = new THREE.Vector3();
	desired.subVectors(target.position(), this.position);

	desired.setLength(this.maxSpeed);

	var steer = new THREE.Vector3();
	steer.subVectors(desired, this.velocity);

	if( steer.lengthSq()>(this.maxForce*this.maxForce) ){
		steer.divideScalar(Math.sqrt(steer.lengthSq()));
		steer.multiplyScalar(this.maxForce);
	}

	this.applyForce(steer);
}

Creature.prototype.returnSeek = function(target){
	var desired = new THREE.Vector3();
	desired.subVectors(target, this.position);

	desired.setLength(this.maxSpeed);

	var steer = new THREE.Vector3();
	steer.subVectors(desired, this.velocity);

	if( steer.lengthSq()>(this.maxForce*this.maxForce) ){
		steer.divideScalar(Math.sqrt(steer.lengthSq()));
		steer.multiplyScalar(this.maxForce);
	}

	return steer;
}

Creature.prototype.arrive = function(target){
	var desired = new THREE.Vector3();
	desired.subVectors(target.position(), this.position);

	var d = desired.length();

	// if(d<5.1) {
	// 	//console.log("too close!");
	// 	sample.trigger(0);
	// }

	if(d<10){
		var m = map_range(d, 0, 100, 0, this.maxSpeed);
		desired.setLength(m);
	} else {
		desired.setLength(this.maxSpeed);
	}

	var steer = new THREE.Vector3();
	steer.subVectors(desired, this.velocity);

	if( steer.lengthSq()>(this.maxForce*this.maxForce) ){
		steer.divideScalar(Math.sqrt(steer.lengthSq()));
		steer.multiplyScalar(this.maxForce);
	}

	steer.multiplyScalar(this.arriveScalar);
	this.applyForce(steer);
}

Creature.prototype.align = function(creatures){
	
	var sum = new THREE.Vector3();
	var steer = new THREE.Vector3();
	var count = 0;
	for(var i=0; i<creatures.length; i++){
		var d = this.position.distanceTo(creatures[i].position);
		if( (d>0) && (d<this.neighbordist) ){
			sum.add(creatures[i].velocity);
			count++;
		}
	}

	if (count>0) {
		sum.divideScalar(count);
		sum.normalize();
		sum.multiplyScalar(this.maxSpeed);

		steer.subVectors(sum, this.velocity);
		steer.clampScalar(-500, this.maxForceSelf);
		
		steer.multiplyScalar(0.1);
		this.applyForce(steer);
	} else {
		var tmp = new THREE.Vector3();
		this.applyForce(tmp); 
	}
}

Creature.prototype.cohesion = function(creatures) {

	var sum = new THREE.Vector3();
	var count = 0;
	for(var i=0; i<creatures.length; i++){
		var d = this.position.distanceTo(creatures[i].position);
		if( (d>0) && (d<this.neighbordist) ){
			sum.add(creatures[i].position);
			count++;
		}
	}

	if (count>0) {
		sum.divideScalar(count);
		var tmp = this.returnSeek(sum);

		tmp.multiplyScalar(0.1);
		this.applyForce(tmp);
	} else {
		var zeroV = new THREE.Vector3();
		this.applyForce(zeroV); 
	} 
}

Creature.prototype.setArriveScalar = function(strength) {
	this.arriveScalar = strength;
}

Creature.prototype.setSeparateSingleScalar = function(strength) {
	this.separateSingleScalar = strength;
}
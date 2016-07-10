
function Thing( pos, geoTwig, geoLeaf, geoEvil ){

	this.position = pos.clone();
	this.acceleration = new THREE.Vector3(0,0,0);
	this.velocity = new THREE.Vector3(0,0,0);

	this.r = 15; // 0.6
	this.maxSpeed = 2; //0.3
	this.maxForce = 0.005; //0.01
	this.maxForceSelf = 0.00001; //0.0001
	this.toChase = true;

	this.neighbordist = 10;

	var lightDis = 20;

	this.separateSingleScalar = 0.1;
	this.arriveScalar = 1;

	this.mesh = new THREE.Object3D();

	//CREATE_FORMS
	// this.leafMat = new THREE.MeshBasicMaterial( {color: 0x17985a, wireframe: true} );
	// this.twigMat = new THREE.MeshBasicMaterial( {color: 0x985a17, wireframe: true} );
	// this.evilMat = new THREE.MeshBasicMaterial( {color: 0x5a1798, wireframe: true} );

	// v.1
    // this.twig = new THREE.Mesh(geoTwig, this.twigMat);
    // // this.twig = new THREE.Mesh(geoTwig, shaderMat_t);
    // this.leaf = new THREE.Mesh(geoLeaf, this.leafMat);
    // this.evil = new THREE.Mesh(geoEvil, this.evilMat);

    // v.2
    this.twig = new THREE.Mesh(geoTwig, twigMat);
    // this.twig = new THREE.Mesh(geoTwig, shaderMat_t);
    this.leaf = new THREE.Mesh(geoLeaf, leafMat);
    this.evil = new THREE.Mesh(geoEvil, evilMat);

    this.mesh.add(this.twig);
	this.mesh.add(this.leaf);
	this.mesh.add(this.evil);

	this.mesh.position.copy(this.position);

	scene.add(this.mesh);
	// this.mesh.children[0].material.visible = false;
	// this.mesh.children[1].material.visible = false;
	this.mesh.children[1].scale.set(0.01, 0.01, 0.01);
	this.mesh.children[2].scale.set(0.01, 0.01, 0.01);
}

/*
Lightbulb.prototype.flock = function(lightbulbs) {
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

LightBulb.prototype.update = function(){
	this.velocity.add(this.acceleration);
	this.velocity.clampScalar(-4,4);
	this.position.add(this.velocity);
	this.acceleration.multiplyScalar(0);

	// Bouncing
	// this.position.y += Math.cos(timeNow*10)*0.01;

	// update real lightBulb
	this.pointL.position.copy(this.position);
}

LightBulb.prototype.applyForce = function(force){
	this.acceleration.add(force);
}

LightBulb.prototype.borders = function(spaceLimit, floor){
	if (this.position.x < -spaceLimit)  this.position.x = spaceLimit;
	if (this.position.z < -spaceLimit)  this.position.z = spaceLimit;
	if (this.position.x > spaceLimit) this.position.x = -spaceLimit;
	if (this.position.z > spaceLimit) this.position.z = -spaceLimit;

	if (this.position.y < floor) this.position.y = floor;
}

// Separate from each other
LightBulb.prototype.separate = function(lightbulbs) {

	var desiredseparation = this.r*2;
	var sum = new THREE.Vector3();
	var count = 0;

	var diff = new THREE.Vector3();
	var steer = new THREE.Vector3();

	// check if they're too close
	for(var i=0; i<lightbulbs.length; i++){
		var d = this.position.distanceTo(lightbulbs[i].position);
		if( (d>0) && (d<desiredseparation) ){
			diff.subVectors(this.position, lightbulbs[i].position);
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
		steer.clampScalar(-100, this.maxForceSelf);	//-500

		// increase intensity
		// steer.multiplyScalar(1.5);

		this.applyForce(steer);
	}
}

LightBulb.prototype.separateSingle = function(target, distance) {

	// var desiredseparation = this.r*40;	//onTheGround
	var desiredseparation = distance;
	var sum = new THREE.Vector3();
	var count = 0;

	var diff = new THREE.Vector3();
	var steer = new THREE.Vector3();

	// check different distance
	var d = this.position.distanceToSquared( target.position );
	
	if( (d<(desiredseparation*desiredseparation)) ){
		diff.subVectors(this.position, target.position);
		diff.normalize();
	}

	diff.normalize();
	diff.multiplyScalar(this.maxSpeed);

	steer.subVectors(diff, this.velocity);
	steer.clampScalar(-500, this.maxForceSelf);

	steer.multiplyScalar(this.separateSingleScalar);
	this.applyForce(steer);
// }
}

LightBulb.prototype.separateFromFloor = function(floor) {

	var desiredseparation = this.r*6;

	var diff = new THREE.Vector3();
	var steer = new THREE.Vector3();

	// check if they're too close
	var d = this.position.y - floor.position.y;
	if( (d<desiredseparation) ){
		// diff.subVectors(this.position, floor.position);
		// diff.x = 0;
		// diff.z = 0;
		// diff.normalize();
		// diff.divideScalar(d);

		steer.y = 0.03;
	}

	// diff.normalize();
	// diff.multiplyScalar(this.maxSpeed);

	// steer.subVectors(diff, this.velocity);
	// steer.clampScalar(-500, this.maxForceSelf);

	// increase intensity
	// steer.multiplyScalar(15.0);

	this.applyForce(steer);
}

LightBulb.prototype.seek = function(target){
	var desired = new THREE.Vector3();
	// desired.subVectors(target.position(), this.position);
	desired.subVectors(target.position, this.position);

	desired.setLength(this.maxSpeed);

	var steer = new THREE.Vector3();
	steer.subVectors(desired, this.velocity);

	if( steer.lengthSq()>(this.maxForce*this.maxForce) ){
		steer.divideScalar(Math.sqrt(steer.lengthSq()));
		steer.multiplyScalar(this.maxForce);
	}

	this.applyForce(steer);
}

LightBulb.prototype.returnSeek = function(target){
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

LightBulb.prototype.arrive = function(target){
	var desired = new THREE.Vector3();
	// desired.subVectors(target.position(), this.position);
	desired.subVectors(target.position, this.position);

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

LightBulb.prototype.align = function(lightbulbs){
	
	var sum = new THREE.Vector3();
	var steer = new THREE.Vector3();
	var count = 0;
	for(var i=0; i<lightbulbs.length; i++){
		var d = this.position.distanceTo(lightbulbs[i].position);
		if( (d>0) && (d<this.neighbordist) ){
			sum.add(lightbulbs[i].velocity);
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

LightBulb.prototype.cohesion = function(lightbulbs) {

	var sum = new THREE.Vector3();
	var count = 0;
	for(var i=0; i<lightbulbs.length; i++){
		var d = this.position.distanceTo(lightbulbs[i].position);
		if( (d>0) && (d<this.neighbordist) ){
			sum.add(lightbulbs[i].position);
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

LightBulb.prototype.setArriveScalar = function(strength) {
	this.arriveScalar = strength;
}

LightBulb.prototype.setSeparateSingleScalar = function(strength) {
	this.separateSingleScalar = strength;
}

LightBulb.prototype.setToChase = function(bool) {
	this.toChase = bool;
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
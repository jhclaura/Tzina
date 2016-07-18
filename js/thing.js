
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

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function Thing( pos, geoTwig, geoLeaf, geoEvil ){

	this.position = pos.clone();
	this.mesh = new THREE.Object3D();

    this.twig = new THREE.Mesh(geoTwig, twigMat);
    this.leaf = new THREE.Mesh(geoLeaf, leafMat);
    this.evil = new THREE.Mesh(geoEvil, evilMat);

    this.mesh.add(this.twig);
	this.mesh.add(this.leaf);
	this.mesh.add(this.evil);

	this.mesh.position.copy(this.position);
	scene.add(this.mesh);
	
	this.mesh.children[0].scale.set(0.01, 0.01, 0.01);
	this.mesh.children[1].scale.set(0.01, 0.01, 0.01);
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
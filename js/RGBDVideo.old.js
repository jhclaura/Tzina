( function () {

	var video = document.createElement( 'video' );

	var precision = 3;

	var linesGeometry = new THREE.Geometry();

	for ( var y = 240; y > - 240; y -= precision ) {

		for ( var x = - 320, x2 = - 320 + precision; x < 320; x += precision, x2 += precision ) {

			linesGeometry.vertices.push( new THREE.Vector3( x, y, 0 ) );
			linesGeometry.vertices.push( new THREE.Vector3( x2, y, 0 ) );

		}

	}

	var pointsGeometry = new THREE.Geometry();

	for ( var y = 240; y > - 240; y -= precision ) {

		for ( var x = - 320; x < 320; x += precision ) {

			pointsGeometry.vertices.push( new THREE.Vector3( x, y, 0 ) );

		}

	}

	RGBDVideo = function ( properties ) {


		THREE.Object3D.call( this );

		var isPlaying = false;

		var imageTexture = THREE.ImageUtils.loadTexture(properties.name + '.png' );

		var videoTexture = new THREE.Texture( video );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		videoTexture.generateMipmaps = false;

		var linesMaterial = new THREE.ShaderMaterial( {

			uniforms: {

				"map": { type: "t", value: imageTexture },
				"opacity": { type: "f", value: 1 },
				"mindepth" : { type : "f", value : properties.mindepth },
				"maxdepth" : { type : "f", value : properties.maxdepth }
			},

			vertexShader: document.getElementById( 'vs' ).textContent,
			fragmentShader: document.getElementById( 'fs' ).textContent,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			wireframe: true,
			transparent: true

		} );

		linesMaterial.linewidth = 1;

		this.add( new THREE.Line( linesGeometry, linesMaterial, THREE.LinePieces ) );

		var pointsMaterial = new THREE.ShaderMaterial( {

			uniforms: {

				"map": { type: "t", value: imageTexture },
				"opacity": { type: "f", value: 1 },
				"mindepth" : { type : "f", value : properties.mindepth },
				"maxdepth" : { type : "f", value : properties.maxdepth }
			},

			vertexShader: document.getElementById( 'vs' ).textContent,
			fragmentShader: document.getElementById( 'fs' ).textContent,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			transparent: true

		} );

		this.add( new THREE.Points( pointsGeometry, pointsMaterial ) );


	};

	RGBDVideo.prototype = Object.create( THREE.Object3D.prototype );

} )();

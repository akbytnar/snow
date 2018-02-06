function webglAvailable() {
        try {
            var canvas = document.createElement( 'canvas' );
            return !!( window.WebGLRenderingContext && (
                canvas.getContext( 'webgl' ) ||
                canvas.getContext( 'experimental-webgl' ) )
            );
        } catch ( e ) {
            return false;
        }
    }

var scene = new THREE.Scene();
var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 45, aspectRatio, 1, 1500 );

var camPosX = 0;
var camPosZ = 1000;
var camPosY = 400;

var renderer = null;

if ( webglAvailable() ) {
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
} else {
    renderer = new THREE.CanvasRenderer({alpha: true, antialias: true });
}

renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("body").appendChild( renderer.domElement );

//mgla 
scene.fog = new THREE.Fog(0xffffff, 100, 1500);

//oswietlenie
var shadowLight = new THREE.DirectionalLight(0xffffff, 1);
shadowLight.position.set(300, 1000, 300);
scene.add(shadowLight);

//ustawienei kamery
camera.position.z = camPosZ;
camera.position.y = camPosY;
camera.position.x = camPosX;
camera.lookAt(new THREE.Vector3( 0, 45, 0 ));


    //podloga 
    var floorTexture = new THREE.TextureLoader().load( 'http://spiralgraphics.biz/packs/snow_ice/previews/Snow.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 5, 5 );
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(window.innerHeight *2, window.innerWidth*2, 1, 1); //width, height, widthSegments, heightSegments
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -6;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

//tworzenie choinek
var createTree = function() {

    //material pnia
  var matTrunk = new THREE.MeshLambertMaterial( {color: 0xA1612B} );
  //material choinki
    var matNeedles = new THREE.MeshLambertMaterial( {color: 0x5A925E} );
  this.mesh = new THREE.Group();
  
  //pien choinki
  var meshTrunk = new THREE.Mesh(new THREE.CylinderGeometry( 5, 5, 10, 4 ), matTrunk);
  meshTrunk.position.y = 5;
  this.mesh.add(meshTrunk);

  //najnizsza warstwa choinki
  var meshNeedles1 = new THREE.Mesh(new THREE.CylinderGeometry( 0, 25, 60, 7 ), matNeedles);
  meshNeedles1.position.y = 40;
    this.mesh.add(meshNeedles1);

  // srednia warstwa choinki
  var meshNeedles2 = new THREE.Mesh(new THREE.CylinderGeometry( 0, 20, 50, 7 ), matNeedles);
  meshNeedles2.position.y = 55;
    this.mesh.add(meshNeedles2);

  // czubek choinki
  var meshNeedles3 = new THREE.Mesh(new THREE.CylinderGeometry( 0, 15, 40, 7 ), matNeedles);
  meshNeedles3.position.y = 70;
  this.mesh.add(meshNeedles3);
  
  // roznorodnosc choinek
  this.variation = (Math.random() - .5) * .7;
  this.mesh.scale.x = 1 + this.variation;
  this.mesh.scale.y = 1 + this.variation;
  this.mesh.scale.z = 1 + this.variation;

};

var forest = new THREE.Group();

// tworzenie choinek i ustawianie ich pozycji
for(var z=0; z<20; z++) {
  for(var x=0; x<20; x++) {
    var tree = new createTree();
    var random = (Math.random() - 0.5) * 25;
    tree.mesh.position.z = (z * 100) - (8 * 100) + random;
    tree.mesh.position.x = (x * 100) - (8 * 100) + random;
    forest.add(tree.mesh);
  }
}

// dodoanie 'lasu' do sceny
scene.add(forest);

// tworzenie platkow sniegu
var snowflakeCount = 6000;
var snowFlakeMaterial = new THREE.PointCloudMaterial({
   color: 0xffffff,
   size: 4,
   blending: THREE.NormalBlending
});

var snowFlakes = new THREE.Geometry;

for (var i = 0; i < snowflakeCount; i++) {
    var pX = Math.random()*1000 - 500,
    pY = Math.random()*500 - 1,
    pZ = Math.random()*1000 - 1,
    particle = new THREE.Vector3(pX, pY, pZ);

    particle.velocity = {};
    particle.velocity.y = Math.random()*(10) - 1;

//dodanie wylosowanych wierzchołków
    snowFlakes.vertices.push(particle);
}

var blizzard = new THREE.PointCloud(snowFlakes, snowFlakeMaterial);
scene.add(blizzard);

// nadanie predkosci platkom sniegu
var simulateSnow = function(){
  var tmpCount = snowflakeCount;
  while (tmpCount--) {
    var sf = snowFlakes.vertices[tmpCount];

    if (sf.y < -200) {
      sf.y = 200;
      sf.velocity.y = 3.2;
    }
    sf.y +=Math.random()*(-10) - 1;

  }
//opad śniegu 
  snowFlakes.verticesNeedUpdate = true;
};

var step = 0;

function render() {
    requestAnimationFrame(render);
    renderer.render( scene, camera );
  camera.position.y = camPosY;
  camera.position.x = camPosX;
  camera.lookAt(new THREE.Vector3( 0, 45, 200 ));
  simulateSnow();
}
render();
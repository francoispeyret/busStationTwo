import * as THREE from 'three';

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

camera.position.z = 25;

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var roadGem = new THREE.PlaneGeometry( 5, 60 );
var roadMat = new THREE.MeshPhongMaterial( { color: 0x333333 } );
var road = new THREE.Mesh( roadGem, roadMat );
road.castShadow = false; //default is false
road.receiveShadow = true; //default
scene.add( road );

var grassGem = new THREE.PlaneGeometry( 70, 60 );
var grassMat = new THREE.MeshPhongMaterial( { color: 0xafff45 } );
var grass = new THREE.Mesh( grassGem, grassMat );
grass.castShadow = false; //default is false
grass.receiveShadow = true; //default
scene.add( grass );
//camera.rotation.x = 1;
road.rotation.x = -0.785398;
road.position.z = 0.1;
grass.rotation.x = -0.785398;

//Create a sphere that cast shadows (but does not receive them)
var sphereGeometry = new THREE.SphereBufferGeometry( 1.5, 32, 32 );
var sphereMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.position.set( 0, .5, 2 );
sphere.castShadow = true; //default is false
sphere.receiveShadow = false; //default
scene.add( sphere );

var light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
light.position.set( 0, 1, .2 );
light.castShadow = true;
light.shadow.radius = 10;
scene.add( light );

var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light

scene.add( ambientLight );


function animate() {
	requestAnimationFrame( animate );
    light.position.x += .001;
	renderer.render( scene, camera );
}
animate();

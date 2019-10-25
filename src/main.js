import * as THREE from 'three';
import Bus from './bus.js';

const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

camera.position.z = 25;
camera.rotation.x = -0.185398;

let renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.onresize = () => {
	renderer.setSize( window.innerWidth, window.innerHeight );
};

let roadGem = new THREE.PlaneGeometry( 15, 60 );
let roadMat = new THREE.MeshPhongMaterial( { color: 0x333333 } );
let road = new THREE.Mesh( roadGem, roadMat );
road.castShadow = false; //default is false
road.receiveShadow = true; //default
scene.add( road );

let grassGem = new THREE.PlaneGeometry( 70, 60 );
let grassMat = new THREE.MeshPhongMaterial( { color: 0xafff45 } );
let grass = new THREE.Mesh( grassGem, grassMat );
grass.castShadow = false; //default is false
grass.receiveShadow = true; //default
grass.rotation.x = -1.5708;
scene.add( grass );
//camera.rotation.x = 1;
road.rotation.x = -1.5708;
road.position.z = 0.1;

let bus = new Bus();
scene.add( bus.mesh );

let light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
light.position.set( 0, 1, .2 );
light.castShadow = true;
light.shadow.radius = 10;
scene.add( light );

let ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light

scene.add( ambientLight );


function animate() {
	requestAnimationFrame( animate );
    light.position.x += .001;
	renderer.render( scene, camera );
}
animate();

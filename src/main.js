import * as THREE from 'three';
import Bus from './world/bus.js';

const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(0,25,30);
camera.lookAt(new THREE.Vector3(0,0,0));

let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1);
renderer.setPixelRatio(2);
renderer.gammaOutPut = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.onresize = () => {
	renderer.setSize( window.innerWidth, window.innerHeight );
};

let roadGem = new THREE.PlaneGeometry( 15, 500 );
let roadMat = new THREE.MeshPhongMaterial( { color: 0x333333 } );
let road = new THREE.Mesh( roadGem, roadMat );
road.castShadow = false; //default is false
road.receiveShadow = true; //default
scene.add( road );

let grassGem = new THREE.PlaneGeometry( 300, 500 );
let grassMat = new THREE.MeshPhongMaterial( { color: 0xafff45 } );
let grass = new THREE.Mesh( grassGem, grassMat );
grass.castShadow = false; //default is false
grass.receiveShadow = true; //default
grass.rotation.x = -1.5708;
grass.position.set(0,-1,0);
scene.add( grass );
//camera.rotation.x = 1;
road.position.set(0,0,0);
road.rotation.x = -1.5708;

let bus = new Bus();
scene.add( bus.container );

let light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
light.position.set( 0, 1, -1);
light.castShadow = true;
light.shadow.radius = 10;
scene.add( light );

let ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light

scene.add( ambientLight );


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();


let   controlLoop      = null;
const controlLoopSpeed = 7;
window.onkeydown = function(e) {
	e.preventDefault();
	e.stopPropagation();
	console.log(e);
	if(typeof bus == 'object') {
		clearInterval(controlLoop);
		if(e.code === 'ArrowLeft') {
			controlLoop = setInterval(function () {
				bus.turnLeft();
			}, controlLoopSpeed);
		}
		if(e.code === 'ArrowRight') {
			controlLoop = setInterval(function () {
				bus.turnRight();
			}, controlLoopSpeed);
		}
	}
};

window.onkeyup = function(e) {
	e.preventDefault();
	e.stopPropagation();
	if(typeof bus == 'object') {
		clearInterval(controlLoop);
	}
}

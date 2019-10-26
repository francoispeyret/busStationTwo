import * as THREE from 'three';
import Bus from './world/bus.js';
import Road from './world/road.js';
import Spawner from './utils/spawner.js';

let scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x59472b, 1000, 3000 );
let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 3000 );
camera.position.set(0,350,450);
camera.lookAt(new THREE.Vector3(0,0,0));

let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1);
renderer.setPixelRatio(1);
renderer.gammaOutPut = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.onresize = () => {
	renderer.setSize( window.innerWidth, window.innerHeight );
};

let light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 5, 0.3 );
light.position.set( 1500, 1500, 0 );
light.target.position.set( 0, 0, 0 );
light.castShadow = true;
light.shadow.radius = 0.5;
light.shadow.camera.near = 500;
light.shadow.camera.far = 2500;
light.shadow.bias = 0.0001;
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
scene.add( light );

let ambientLight = new THREE.AmbientLight( 0x115099 ); // soft white light

ambientLight.intensity = 0.5;

scene.add( ambientLight );

let road = new Road();
scene.add( road.container );


let bus = new Bus();
scene.add( bus.container );

let spawner = new Spawner(scene);


let clock = new THREE.Clock();
let delta = 0;
// 30 fps
let interval = 1 / 60;

function animate() {
	requestAnimationFrame( animate );
	delta += clock.getDelta();
	if (delta  > interval) {
		spawner.animate(bus);
	 	bus.animate();
	 	road.animate(bus.vel.value);
	 	renderer.render( scene, camera );
		delta = delta % interval;
   }
}
animate();


let   controlLoop      = null;
window.onkeydown = function(e) {
	if(typeof bus == 'object') {
		clearInterval(controlLoop);
		if(e.code === 'ArrowLeft') {
			controlLoop = setInterval(function () {
				bus.turnLeft();
			}, 1);
		}
		if(e.code === 'ArrowRight') {
			controlLoop = setInterval(function () {
				bus.turnRight();
			}, 1);
		}
	}
};

window.onkeyup = function(e) {
	if(typeof bus == 'object') {
		clearInterval(controlLoop);
	}
}

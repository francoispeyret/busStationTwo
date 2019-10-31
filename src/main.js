import * as THREE from 'three';
import Camera from './utils/camera.js';
import Renderer from './utils/renderer.js';
import Sun from './world/sun.js';
import Bus from './world/bus.js';
import Road from './world/road.js';
import Spawner from './utils/spawner.js';

class Application {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new Camera();
		this.renderer = new Renderer();
		this.spawner = new Spawner(this.scene);
		this.world = {
			sun: new Sun(),
			road: new Road(),
			bus: new Bus(),
		};
		this.animateOption = {
			clock: new THREE.Clock(),
			delta: 0,
			interval: 1 / 60
		};
		this.control = {
			loop: null
		}
		this.initScene();
		this.initControl();
        this.animate = this.animate.bind(this);
		this.animate();
	}

	animate() {

		window.requestAnimationFrame( this.animate );
		this.animateOption.delta += this.animateOption.clock.getDelta();
		if (this.animateOption.delta  > this.animateOption.interval) {
			this.spawner.animate(this.world.bus);
			this.world.sun.animate();
			this.world.bus.animate(this.world.sun);
			this.world.road.animate(this.world.bus.vel.value);
			this.renderer.r.render( this.scene, this.camera.c );
			this.animateOption.delta =
				this.animateOption.delta % this.animateOption.interval;
	   }
   };

	initScene() {
		this.scene.add(this.world.road.container);
		this.scene.add(this.world.sun.light);
		this.scene.add(this.world.sun.ambient);
		this.scene.add(this.world.bus.container);
	}

	initControl() {
		var that = this;
		window.onkeydown = function(e) {
			if(typeof that.world.bus == 'object') {
				clearInterval(that.control.loop);
				switch (e.code) {
					case 'ArrowLeft':
						that.control.loop = setInterval(function () {
							that.world.bus.turnLeft();
						}, 1);
						break;
					case 'ArrowRight':
						that.control.loop = setInterval(function () {
							that.world.bus.turnRight();
						}, 1);
						break;
					case 'ArrowUp':
						that.control.loop = setInterval(function () {
							that.world.bus.speedUp();
						}, 1);
						break;
					case 'ArrowDown':
						that.control.loop = setInterval(function () {
							that.world.bus.speedDown();
						}, 1);
						break;

				}
			}
		}
		window.onkeyup = function(e) {
			if(typeof that.world.bus == 'object') {
				clearInterval(that.control.loop);
		        that.world.bus.keyUp();
			}
		}
	}

}

let app = new Application();

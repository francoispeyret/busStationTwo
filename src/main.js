import * as THREE from 'three';
import Camera from './utils/camera.js';
import Renderer from './utils/renderer.js';
import Sun from './world/sun.js';
import Bus from './world/bus.js';
import Road from './world/road.js';
import Spawner from './utils/spawner.js';

import * as CANNON from 'cannon';

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
			loop: null,
			loopSpeedState: false,
			loopSpeed: null,
			loopRotateState: false,
			loopRotate: null,
			loopUpState: false,
			loopUp: null,
		}

		this.cannon = {
			lastTime: null,
			time: null,
			world: new CANNON.World(),
			groud: {
				body: new CANNON.Body({mass: 0}),
				shape: new CANNON.Plane(),
			},
			sphere:{
				model: null,
				body: new CANNON.Body({
					mass: 5, // kg
					position: new CANNON.Vec3(0, 0, 100), // m
					shape: new CANNON.Sphere(1)
				})
			},
		}
		this.cannon.world.gravity = new CANNON.Vec3(0, 0, -100);
		this.cannon.world.addBody(this.cannon.sphere.body);

		this.cannon.groud.body.addShape(this.cannon.groud.shape);
		this.cannon.world.addBody(this.cannon.groud.body);

		this.initScene();
		this.initControl();
		this.animate = this.animate.bind(this);
		this.animate();
	}

	animate() {
		var fixedTimeStep = 1.0 / 60.0; // seconds
		var maxSubSteps = 3;
		window.requestAnimationFrame( this.animate );
		if(this.cannon.lastTime !== undefined && this.cannon.world !== undefined){
			var dt = (this.cannon.time - this.cannon.lastTime) / 1000;
			this.cannon.world.step(fixedTimeStep, dt, maxSubSteps);
		}
		console.log(this.cannon.world);
		this.cannon.lastTime = this.cannon.time;
		this.animateOption.delta += this.animateOption.clock.getDelta();
		if (this.animateOption.delta  > this.animateOption.interval) {
			this.spawner.animate(this.world.bus);
			this.world.sun.animate(this.world.bus);
			this.world.bus.animate(this.world.sun);
			this.camera.updatePosition(this.world.bus);
			this.world.road.animate(this.world.bus.vel.value);
			this.renderer.r.render( this.scene, this.camera.c );
			this.animateOption.delta = this.animateOption.delta % this.animateOption.interval;
			this.cannon.sphere.model.position.set(
				this.cannon.sphere.body.position.x,
				this.cannon.sphere.body.position.z,
				this.cannon.sphere.body.position.y
			)
	   }
   };

	initScene() {
		this.scene.add(this.world.road.container);
		this.scene.add(this.world.sun.light);
		this.scene.add(this.world.sun.ambient);
		this.scene.add(this.world.bus.container);

		var geometry = new THREE.SphereGeometry( 10, 32, 32 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		this.cannon.sphere.model = new THREE.Mesh( geometry, material );
		this.cannon.sphere.model.position.set(
			this.cannon.sphere.body.position.x * 100,
			this.cannon.sphere.body.position.z * 100,
			this.cannon.sphere.body.position.y * 100
			)
		this.scene.add( this.cannon.sphere.model );
	}

	initControl() {
		var that = this;
		window.onkeydown = function(e) {
			if(typeof that.world.bus == 'object') {
				clearInterval(that.control.loop);
				switch (e.code) {
					case 'ArrowLeft':
						if(that.control.loopRotateState === false) {
							that.control.loopRotate = setInterval(function () {
								that.world.bus.turnLeft();
							}, 1);
							that.control.loopRotateState = true;
						}
						break;
					case 'ArrowRight':
						if(that.control.loopRotateState === false) {
							that.control.loopRotate = setInterval(function () {
								that.world.bus.turnRight();
							}, 1);
							that.control.loopRotateState = true;
						}
						break;
					case 'ArrowUp':
						if(that.control.loopSpeedState === false) {
							that.control.loopSpeed = setInterval(function () {
								that.world.bus.speedUp();
							}, 1);
							that.control.loopSpeedState = true;
						}
						break;
					case 'ArrowDown':
						if(that.control.loopSpeedState === false) {
							that.control.loopSpeed = setInterval(function () {
								that.world.bus.speedDown();
							}, 1);
							that.control.loopSpeedState = true;
						}
						break;
					case 'ShiftRight':
						if(that.control.loopUpState === false) {
							that.control.loopUp = setInterval(function () {
								that.world.bus.takeOff();
							}, 1);
							that.control.loopUpState = true;
						}
						break;
					case 'ControlRight':
						if(that.control.loopUpState === false) {
							that.control.loopUp = setInterval(function () {
								that.world.bus.down();
							}, 1);
							that.control.loopUpState = true;
						}
						break;

				}
			}
		}
		window.onkeyup = function(e) {
			if(typeof that.world.bus == 'object') {
				clearInterval(that.control.loop);
				switch (e.code) {
					case 'ArrowLeft':
						clearInterval(that.control.loopRotate);
						that.control.loopRotateState = false;
						break;
					case 'ArrowRight':
						clearInterval(that.control.loopRotate);
						that.control.loopRotateState = false;
						break;
					case 'ArrowUp':
						clearInterval(that.control.loopSpeed);
						that.control.loopSpeedState = false;
						break;
					case 'ArrowDown':
						clearInterval(that.control.loopSpeed);
						that.control.loopSpeedState = false;
						break;
					case 'ShiftRight':
						clearInterval(that.control.loopUp);
						that.control.loopUpState = false;
						break;
					case 'ControlRight':
						clearInterval(that.control.loopUp);
						that.control.loopUpState = false;
						break;

				}
		        that.world.bus.keyUp();
			}
		}
	}

}

let app = new Application();

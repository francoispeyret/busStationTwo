import * as THREE from 'three';
import Camera from './utils/camera.js';
import Renderer from './utils/renderer.js';
import Sun from './world/sun.js';
import Bus from './world/bus.js';
import Road from './world/road.js';
import Spawner from './utils/spawner.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';
import { GUI } from '../node_modules/three/examples/jsm/libs/dat.gui.module.js';

import * as CANNON from 'cannon-es';
import cannonDebugger from 'cannon-es-debugger'
import Time from './utils/time.js';

class Application {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new Camera();
		this.renderer = new Renderer();
		
		this.container = document.createElement( 'div' );
		document.body.appendChild( this.container );

		this.stats = new Stats();
		this.container.appendChild( this.stats.dom );


		this.time = new Time();
		
		this.animateOption = {
			clock: new THREE.Clock(),
			delta: 16,
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
			floor: {
				body: new CANNON.Body({
					mass: 0,
					shape: new CANNON.Plane(),
					position: new CANNON.Vec3(0, 0, 0)
				})
			},
			sphere:{
				model: new THREE.Mesh( 
					new THREE.CylinderGeometry( 10, 50, 200, 24),
					new THREE.MeshLambertMaterial( {color: 0xffff00} )
					),
				body: new CANNON.Body({
					mass: 50000, // kg
					position: new CANNON.Vec3(200, 200, 0), // m
					shape: new CANNON.Box(new CANNON.Vec3(50,100,50))
				})
			},
		}
		this.cannon.world.gravity = new CANNON.Vec3(0, -98, 0);
		this.cannon.world.solver.iterations = 10;
		this.cannon.world.defaultContactMaterial.friction = 0.2;
		this.cannon.world.addBody(this.cannon.sphere.body);
		
        var groundMaterial = new CANNON.Material('groundMaterial')
        var wheelMaterial = new CANNON.Material('wheelMaterial')
        var wheelGroundContactMaterial = (window.wheelGroundContactMaterial = new CANNON.ContactMaterial(
          wheelMaterial,
          groundMaterial,
          {
            friction: 0.1,
            restitution: 0,
            contactEquationStiffness: 1000,
          }
		))
        // We must add the contact materials to the world
        this.cannon.world.addContactMaterial(wheelGroundContactMaterial)

		
		this.cannon.floor.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);
		this.cannon.floor.body.material = groundMaterial;
		this.cannon.world.addBody(this.cannon.floor.body);
		cannonDebugger(this.scene, this.cannon.world.bodies)
		
		this.world = {
			sun: new Sun(),
			road: new Road(this.cannon),
			bus: new Bus(this.cannon),
		};

		this.initScene();
		this.initControl();
		this.animate = this.animate.bind(this);
		this.animate();
	}

	animate() {
		var fixedTimeStep = 1.0 / 60.0; // seconds
		var maxSubSteps = 1;
		window.requestAnimationFrame( this.animate );
		this.stats.update();
		this.cannon.lastTime = this.cannon.time;
		this.animateOption.delta += this.animateOption.clock.getDelta();
		if (this.animateOption.delta  > this.animateOption.interval) {
			this.world.sun.animate(this.world.bus);
			this.world.bus.animate(this.world.sun);
			this.world.road.animate(this.world.bus);
			this.camera.updatePosition(this.world.bus);
			this.renderer.r.render( this.scene, this.camera.c );
			this.animateOption.delta = this.animateOption.delta % this.animateOption.interval;
			this.cannon.sphere.model.position.copy(this.cannon.sphere.body.position)
			this.cannon.sphere.model.quaternion.copy(this.cannon.sphere.body.quaternion)
			if(this.cannon.lastTime !== undefined && this.cannon.world !== undefined){
				var dt = (this.cannon.time - this.cannon.lastTime) / 1000;
				this.cannon.world.step(this.animateOption.delta);
			}
	   }
   };

	initScene() {
		this.scene.fog = new THREE.FogExp2(0x66c1d4, 0.00025)

		this.scene.add(this.world.road.container);
		this.scene.add(this.world.sun.light);
		this.scene.add(this.world.sun.ambient);
		this.scene.add(this.world.bus.container);

		this.cannon.sphere.model.castShadow = true;
		this.cannon.sphere.model.receiveShadow = true;
		this.cannon.sphere.model.position.copy(this.cannon.sphere.body.position);
		this.cannon.sphere.model.quaternion.copy(this.cannon.sphere.body.quaternion);
		this.scene.add( this.cannon.sphere.model );
	}

	initControl() {
		document.onkeydown = this.handlerControl;
		document.onkeyup = this.handlerControl;
	}

	handlerControl(event) {
		const that = app;
		const busControl = that.world.bus.vehicule;
        const up = event.type == 'keyup'
		if (!up && event.type !== 'keydown') return;
		
		var maxSteerVal = Math.PI / 8;
		var maxSpeed = 10;
		var maxForce = 1000000;
		
		console.log(event.code);

		switch (event.code) {
			case 'KeyA':
			case 'ArrowLeft':
				busControl.setSteeringValue(up ? 0 : maxSteerVal, 1)
				busControl.setSteeringValue(up ? 0 : maxSteerVal, 2)
			case 'KeyD':
			case 'ArrowRight':
				busControl.setSteeringValue(up ? 0 : -maxSteerVal, 1)
				busControl.setSteeringValue(up ? 0 : -maxSteerVal, 2)
				break;
			case 'KeyW':
			case 'ArrowUp':
				busControl.setWheelForce(up ? 0 : -maxForce, 0)
				busControl.setWheelForce(up ? 0 : -maxForce, 3)
				break;
			case 'KeyS':
			case 'ArrowDown':
				busControl.setWheelForce(up ? 0 : maxForce / 2, 0)
				busControl.setWheelForce(up ? 0 : maxForce / 2, 3)
				break;
			case 'Space':
			case 'ShiftRight':
				that.world.bus.takeOff();
				break;
			case 'ConstrolLeft':
			case 'ControlRight':
				that.world.bus.down();
			break;
		}
	}

}

let app = new Application();

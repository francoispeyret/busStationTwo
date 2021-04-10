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

class Application {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new Camera();
		this.renderer = new Renderer();
		
		this.container = document.createElement( 'div' );
		document.body.appendChild( this.container );

		this.stats = new Stats();
		this.container.appendChild( this.stats.dom );

		
		this.animateOption = {
			clock: new THREE.Clock(),
			delta: 0,
			oldElapsedTime: 0,
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
		};

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
		}
		this.cannon.world.gravity = new CANNON.Vec3(0, 0, -10);
		this.cannon.world.solver.iterations = 1;
		this.cannon.world.defaultContactMaterial.friction = 0.1;
		
        var groundMaterial = new CANNON.Material('groundMaterial')
        var wheelMaterial = new CANNON.Material('wheelMaterial')
        var wheelGroundContactMaterial = (window.wheelGroundContactMaterial = new CANNON.ContactMaterial(
          wheelMaterial,
          groundMaterial,
          {
            friction: 0.3,
            restitution: 0,
			contactEquationStiffness: 100,
			frictionEquationStiffness: 100
          }
		))
        // We must add the contact materials to the world
        this.cannon.world.addContactMaterial(wheelGroundContactMaterial)

		//this.cannon.floor.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);
		this.cannon.floor.body.material = groundMaterial;
		this.cannon.world.addBody(this.cannon.floor.body);
		//cannonDebugger(this.scene, this.cannon.world.bodies)
		
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

		const elapsedTime = this.animateOption.clock.getElapsedTime();
		this.animateOption.delta = elapsedTime - this.animateOption.oldElapsedTime;
		this.animateOption.oldElapsedTime = elapsedTime;

		window.requestAnimationFrame( this.animate );
		this.stats.update();
		this.world.sun.animate(this.world.bus);
		this.world.bus.animate(this.world.sun);
		this.world.road.animate(this.world.bus);
		this.camera.updatePosition(this.world.bus);
		this.renderer.r.render( this.scene, this.camera.c );
		if(this.cannon.world !== undefined){
			this.cannon.world.step(1/60,this.animateOption.delta, 0.005);
		}
   };

	initScene() {
		this.scene.fog = new THREE.FogExp2(0x66c1d4, 0.005)

		this.scene.add(this.world.road.container);
		this.scene.add(this.world.sun.light);
		this.scene.add(this.world.sun.ambient);
		this.scene.add(this.world.bus.container);


		let that = this;
		window.addEventListener('resize',function(){
			that.resize()
		}, false);

		document.querySelector('button#start').addEventListener('click', function(){
			that.handlerStart(event, that);
			document.querySelector('button#start').style.display = 'none';
		}, false)
	}

	resize() {
		this.camera.c.aspect = window.innerWidth / window.innerHeight;
		this.camera.c.updateProjectionMatrix();

		this.renderer.r.setSize(window.innerWidth, window.innerHeight);
	}

	initControl() {
		document.onkeydown = (event) => this.handlerControl(event, this);
		document.onkeyup = (event) => this.handlerControl(event, this);
		document.querySelector('.reset').addEventListener('click', (event) => this.handlerReset(event, this));
	}

	handlerReset(event, that) {
		that.world.bus.reset();
	}

	handlerStart(event, that) {
		that.scene.add(that.world.bus.container);
		that.world.bus.reset();
	}

	handlerControl(event,that) {
		const busControl = that.world.bus.vehicule;
		const up = event.type == 'keyup';
		
		var maxSteerVal = 0.5;
		var maxSpeed = 10;
		var maxForce = 1000;
		
        busControl.setBrake(0, 0)
        busControl.setBrake(0, 1)
        busControl.setBrake(0, 2)
        busControl.setBrake(0, 3)


		console.log(event.code);

		switch (event.code) {
			case 'KeyA':
			case 'ArrowLeft':
				if (!up && event.type !== 'keydown') return;
				busControl.setSteeringValue(up ? 0 : maxSteerVal, 0)
				busControl.setSteeringValue(up ? 0 : maxSteerVal, 1)
				break;
			case 'KeyD':
			case 'ArrowRight':
				if (!up && event.type !== 'keydown') return;
				busControl.setSteeringValue(up ? 0 : -maxSteerVal, 0)
				busControl.setSteeringValue(up ? 0 : -maxSteerVal, 1)
				break;
			case 'KeyW':
			case 'ArrowUp':
				if (!up && event.type !== 'keydown') return;
				busControl.applyEngineForce(up ? 0 : -maxForce, 2)
				busControl.applyEngineForce(up ? 0 : -maxForce, 3)
				break;
			case 'KeyS':
			case 'ArrowDown':
				if (!up && event.type !== 'keydown') return;
				busControl.applyEngineForce(up ? 0 : maxForce, 2)
				busControl.applyEngineForce(up ? 0 : maxForce, 3)
				break;
			case 'Space':
			case 'ShiftRight':
				if (!up && event.type !== 'keydown') return;
				that.world.bus.takeOff();
				break;
			case 'ConstrolLeft':
			case 'ControlRight':
				if (!up && event.type !== 'keydown') return;
				that.world.bus.down();
			break;
			case 'Delete':
				if (!up) return;
				that.world.bus.reset();
			break;
		}
	}

}

let app = new Application();

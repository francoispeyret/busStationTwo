import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from 'cannon-es';
import Tree from "./tree";

export default class Bus {
    constructor(cannon) {
        this.cannon = cannon;

        this.time = 0;
        this.size = {
            w: 70,
            d: 200,
            h: 55
        };

        this.chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1, 1.2));
        
        this.chassisBody = new CANNON.Body({ mass: 1000 });
        this.chassisBody.addShape(this.chassisShape, new CANNON.Vec3());
        this.chassisBody.position.set(10, 0, 5);
        this.chassisBody.angularVelocity.set(0, 0, 8.25);

        this.vehicule = new CANNON.RaycastVehicle({
            chassisBody: this.chassisBody
        });

        let options = {
            radius: 0.5,
            directionLocal: new CANNON.Vec3(0, 0, -1),
            suspensionStiffness: 15,
            suspensionRestLength: 0.1,
            frictionSlip: 1,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 10000000,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(0, 1, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
            maxSuspensionTravel: 0.3,
            customSlidingRotationalSpeed: -5,
            useCustomSlidingRotationalSpeed: true,
        };

        let Zaxe = -1.2;

        options.chassisConnectionPointLocal.set(1.3, 1, Zaxe);
        this.vehicule.addWheel(options);

        options.chassisConnectionPointLocal.set(1.3, -1, Zaxe);
        this.vehicule.addWheel(options);

        options.chassisConnectionPointLocal.set(-1.3, 1, Zaxe);
        this.vehicule.addWheel(options);

        options.chassisConnectionPointLocal.set(-1.3, -1, Zaxe);
        this.vehicule.addWheel(options);

        this.wheels = [];
        this.setModel();

        this.angle = 0;
        this.angleDelta = 0.01;

        this.maxPosY = 1500;

        this.container = new THREE.Object3D();
        this.container.castShadow = true;
        this.container.receiveShadow = true;
        this.bus = new THREE.Object3D();
        this.container.add(this.bus);

        this.rotor = null;
        this.engineAudio = new Audio('./engine_loop_3.mp3');

        this.engineAudio.loop = true;
        this.engineAudio.volume = 0.1;
        this.engineAudio.loopStart = 0.1;
        //this.engineAudio.play();

        this.kmhEl = document.querySelector('.kmh > .val');

        this.hitsAudio = [
            new Audio('./hit1.mp3'),
            new Audio('./hit2.mp3'),
            new Audio('./hit3.mp3')
        ];

        this.chassisBody.addEventListener('collide', (e) => this.hit(e,this))

    }

    hit(e, that) {
        const indexRandom = Math.floor(Math.random() * this.hitsAudio.length);
        that.hitsAudio[indexRandom].play();
    }

    animate() {
        this.time++;

        this.container.position.copy(this.chassisBody.position);
        this.container.quaternion.copy(this.chassisBody.quaternion);

        // gestion de la position si trop loin dans la map (boucle)
        const distance = this.container.position.distanceTo(new CANNON.Vec3(0,0,0))
        if(distance > 250) {
            this.chassisBody.position.copy(
                new CANNON.Vec3(
                    -this.chassisBody.position.x,
                    -this.chassisBody.position.y,
                    this.chassisBody.position.z
                    )
            )
        }      

        const playbackSpeed = Math.min((Math.abs(this.vehicule.currentVehicleSpeedKmHour)+5)/10, 2);
        this.engineAudio.playbackRate = playbackSpeed;
        
        // display speed in html
        this.kmhEl.innerHTML = Math.floor(Math.abs(this.vehicule.currentVehicleSpeedKmHour));

        if(this.rotor) {
            this.rotor.rotation.y -= Math.sin(0.05 + (this.container.position.z / 50));
        }
    }

    takeOff() {
        this.chassisBody.applyLocalImpulse(new CANNON.Vec3(0,0,600), new CANNON.Vec3(0,0,0))
    }

    down() {
        if(this.container.position.y > -15) {
            this.vel.vector.y -= .5;
        }
    }

    reset() {
        this.engineAudio.play();
        this.vehicule.chassisBody.position.set(10,0,5)
        this.chassisBody.angularVelocity.set(0, 0, 8.25)
        this.vehicule.chassisBody.quaternion.copy(new CANNON.Quaternion());
    }

    setModel() {
        var loader = new FBXLoader();
        var that = this;
        var mesh;

        loader.load( './models/bus2.fbx', function ( object ) {
            object.traverse( function ( child ) {
                if(child.name == 'lamp1' || child.name == 'lamp2') {
                    let lampMaterail = new THREE.MeshLambertMaterial({color: 0x000000, emissive: 0xffe6a5})
                    child.material = lampMaterail;
                }
                if(child.name == 'lampStop1' || child.name == 'lampStop2') {
                    let lampMaterail = new THREE.MeshLambertMaterial({color: 0x000000, emissive: 0xad381b})
                    child.material = lampMaterail;
                }
                if(child.name == 'rotor') {
                    that.rotor = child;
                }
                if(child.name.indexOf('wheel') > -1) {
                    var wheel = that.vehicule.wheelInfos[that.wheels.length];
                    var cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
                    var wheelBody = new CANNON.Body({
                        mass: 0,
                    });
                    wheelBody.type = CANNON.Body.KINEMATIC;
                    wheelBody.collisionFilterGroup = 0;// turn off collisions
                    var q = new CANNON.Quaternion();
                    q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
                    wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
                    that.wheels.push (wheelBody );
                    that.cannon.world.addBody( wheelBody );
                }
                if ( child.isMesh ) {
                    child.castShadow = true;
                }
            } );
            mesh = object;
            mesh.scale.set(0.3,0.3,0.3);
            mesh.position.z = -1.5;
            mesh.rotation.x = Math.PI/2;
            that.bus.add( mesh );

            that.vehicule.addToWorld(that.cannon.world);
            that.cannon.world.addEventListener('postStep', function () {
                for (var i = 0; i < that.vehicule.wheelInfos.length; i++) {
                    that.vehicule.updateWheelTransform(i);
                    var t = that.vehicule.wheelInfos[i].worldTransform
                    var wheelBody = that.wheels[i]
                    wheelBody.position.copy(t.position)
                    wheelBody.quaternion.copy(t.quaternion)
                }
            });
        });
    }

}

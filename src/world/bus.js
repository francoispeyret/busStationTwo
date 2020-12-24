import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from 'cannon-es';

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
        this.chassisBody.addShape(this.chassisShape, new CANNON.Vec3())
        this.chassisBody.position.set(-0,0,5);
        this.chassisBody.angularVelocity.set(0, 0, 8.25)

        this.vehicule = new CANNON.RaycastVehicle({
            chassisBody: this.chassisBody
        });

        var options = {
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
          }
  

        let Zaxe = -1.2;

        options.chassisConnectionPointLocal.set(1, 1, Zaxe);
        this.vehicule.addWheel(options);

        options.chassisConnectionPointLocal.set(1, -1, Zaxe);
        this.vehicule.addWheel(options);

        options.chassisConnectionPointLocal.set(-1, 1, Zaxe);
        this.vehicule.addWheel(options);

        options.chassisConnectionPointLocal.set(-1, -1, Zaxe);
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

        this.engineAudio = new Audio('/engine_loop_3.mp3');

        this.engineAudio.loop = true;
        this.engineAudio.volume = 0.1;
        this.engineAudio.loopStart = 0.1;
        //this.engineAudio.play();

    }

    animate() {
        this.time++;
        this.container.position.copy(this.chassisBody.position);
        this.container.quaternion.copy(this.chassisBody.quaternion);
        //this.bus.rotation.x = -this.vel.value/20 * ((this.container.position.y + 25)/this.maxPosY);
        //this.container.rotation.y = -this.angle;        
        

        const playbackSpeed = Math.min(
            (Math.abs(this.vehicule.currentVehicleSpeedKmHour)+5)/10,
            2
            );
        this.engineAudio.playbackRate = playbackSpeed;

        console.log(playbackSpeed );

        if(this.rotor) {
            const onGround = this.container.position.y > -25 ? 0.05 : 0;
            this.rotor.rotation.y -= Math.sin(0.05 + onGround + (this.container.position.y / 2500));
        }
        
    }

    takeOff() {
        //console.log(this.chassisBody);
        //this.chassisBody.applyLocalImpulse(new CANNON.Vec3(0,1000,0), new CANNON.Vec3(0,0,0))
    }

    down() {
        if(this.container.position.y > -15) {
            this.vel.vector.y -= .5;
        }
    }

    reset() {
        this.engineAudio.play();
        this.vehicule.chassisBody.position.z = 5;
        this.chassisBody.angularVelocity.set(0, 0, 8.25)
        this.vehicule.chassisBody.quaternion.copy(new CANNON.Quaternion());
    }

    setModel() {
        var loader = new FBXLoader();
        var that = this;
        var mesh;

        var axisWidth = 70;

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
                    that.wheels.push(wheelBody);
                    that.cannon.world.addBody(wheelBody);
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
            })
        } );
    }

}

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

        this.centerOfMassAdjust = new CANNON.Vec3(0, 0, -1);
        this.chassisShape = new CANNON.Box(new CANNON.Vec3(35, 50, 70));
        this.chassisBody = new CANNON.Body({ mass: 50 });
        this.chassisBody.addShape(this.chassisShape, this.centerOfMassAdjust);
        this.chassisBody.position.set(0,150,0);

        this.vehicule = new CANNON.RigidVehicle({
            chassisBody: this.chassisBody
        });

        this.setModel();

        this.angle = 0;
        this.angleDelta = 0.01;

        this.maxPosY = 1500;

        this.vel = {
            value: 0,
            rotate: 0,
            speedUp: .02,
            speedDown: .001,
            max: 10,
            vector: {
                x: 0,
                y: 0,
                z: 0
            }
        }

        this.container = new THREE.Object3D();
        this.container.castShadow = true;
        this.container.receiveShadow = true;
        this.bus = new THREE.Object3D();
        this.container.add(this.bus);

        this.rotor = null;

        this.wheels = [
            null,
            null,
            null,
            null
        ];
        
    }

    animate() {
        this.time++;
        this.container.position.copy(this.chassisBody.position);
        this.container.quaternion.copy(this.chassisBody.quaternion)
        this.vel.vector.y = this.vel.vector.y / 1.5;
        //this.bus.rotation.x = -this.vel.value/20 * ((this.container.position.y + 25)/this.maxPosY);
        //this.container.rotation.y = -this.angle;        

        if(this.rotor) {
            const onGround = this.container.position.y > -25 ? 0.05 : 0;
            this.rotor.rotation.y -= Math.sin(0.05 + onGround + (this.container.position.y / 2500));
        }
    }

    takeOff() {
        if(this.container.position.y < this.maxPosY) {
            this.vel.vector.y += .5;
        }
    }

    down() {
        if(this.container.position.y > -15) {
            this.vel.vector.y -= .5;
        }
    }

    setModel() {
        var loader = new FBXLoader();
        var that = this;
        var mesh;

        var axisWidth = 70;

        loader.load( './models/bus.fbx', function ( object ) {
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
                }
                if(child.name == 'wheelFrontLeft') {
                    that.wheels[0] = child;
                    var wheelMaterial = new CANNON.Material('wheelMaterial');
                    var down = new CANNON.Vec3(0, 0, -1);
                    var wheelShape = new CANNON.Sphere(25);
                    var wheelBody = new CANNON.Body({ mass: 50, material: wheelMaterial });
                    wheelBody.addShape(wheelShape)
                    that.vehicule.addWheel({
                        body: wheelBody,
                        position: new CANNON.Vec3(-50, -50, -100).vadd(that.centerOfMassAdjust),
                        axis: new CANNON.Vec3(1, 0, 0),
                        direction: down,
                      });
                }
                if(child.name == 'wheelFrontRight') {
                    that.wheels[1] = child;
                    var wheelMaterial = new CANNON.Material('wheelMaterial');
                    var down = new CANNON.Vec3(0, -1, 0);
                    var wheelShape = new CANNON.Cylinder(25,25,25,25);
                    console.log(wheelShape);
                    var wheelBody = new CANNON.Body({ mass: 50, material: wheelMaterial });
                    wheelBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -Math.PI * 0.5);
                    wheelBody.addShape(wheelShape)
                    that.vehicule.addWheel({
                        body: wheelBody,
                        position: new CANNON.Vec3(50, -50, -100).vadd(that.centerOfMassAdjust),
                        axis: new CANNON.Vec3(0, 0, 1),
                        direction: down,
                      });
                }
                if(child.name == 'wheelBackLeft') {
                    that.wheels[2] = child;
                    var wheelMaterial = new CANNON.Material('wheelMaterial');
                    var down = new CANNON.Vec3(0, 0, -1);
                    var wheelShape = new CANNON.Sphere(25);
                    var wheelBody = new CANNON.Body({ mass: 50, material: wheelMaterial });
                    wheelBody.addShape(wheelShape)
                    that.vehicule.addWheel({
                        body: wheelBody,
                        position: new CANNON.Vec3(-50, -50, 100).vadd(that.centerOfMassAdjust),
                        axis: new CANNON.Vec3(1, 0, 0),
                        direction: down,
                      });
                }
                if(child.name == 'wheelBackRight') {
                    that.wheels[3] = child;
                    var wheelMaterial = new CANNON.Material('wheelMaterial');
                    var down = new CANNON.Vec3(0, 0, -1);
                    var wheelShape = new CANNON.Sphere(25);
                    var wheelBody = new CANNON.Body({ mass: 50, material: wheelMaterial });
                    wheelBody.addShape(wheelShape)
                    that.vehicule.addWheel({
                        body: wheelBody,
                        position: new CANNON.Vec3(50, -50, 100).vadd(that.centerOfMassAdjust),
                        axis: new CANNON.Vec3(1, 0, 0),
                        direction: down,
                      });
                }
                if ( child.isMesh ) {
                    child.castShadow = true;
                }
            } );
            mesh = object;
            mesh.rotation.y = Math.PI/2;
            mesh.position.y = -35;
            that.bus.add( mesh );

            for (var i = 0; i < that.vehicule.wheelBodies.length; i++) {
                that.vehicule.wheelBodies[i].angularDamping = 0.4
              }
            that.vehicule.addToWorld(that.cannon.world);
        } );
    }

}

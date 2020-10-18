import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export default class Bus {
    constructor(_options) {

        this.time = 0;

        this.size = {
            w: 70,
            d: 160,
            h: 55
        }

        this.angle = 0;
        this.angleDelta = 0.01;

        this.maxPosY = 300;

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
        this.container.position.y = -25;
        this.container.position.z = 40;
        this.container.position.y = 100;
        this.bus = new THREE.Object3D();
        this.container.add(this.bus);

        new THREE.AxesHelper( 5 );
        
        this.rotor = null;

        this.wheels = [
            null,
            null,
            null,
            null
        ];
        
        this.setModel();
    }

    animate(sun) {
        this.time++;
        this.container.position.add({
            x: this.vel.vector.x,
            y: this.vel.vector.y,
            z: this.vel.vector.z
        });


        this.bus.rotation.x = -this.vel.value/20 * ((this.container.position.y + 25)/this.maxPosY);
        this.container.rotation.y = -this.angle;
        

        if(this.rotor) {
            const onGround = this.container.position.y > -25 ? 0.05 : 0;
            this.rotor.rotation.y -= Math.sin(0.05 + onGround + (this.container.position.y / 2500));
        }

        for(let wheel of this.wheels) {
            if(wheel != null) {
                wheel.rotation.y += -this.vel.value / 100;
            }
        }
        
        if(this.vel.value > 0 ) {
            this.vel.value -= this.vel.speedDown;
        }
    }

    canTurn() {
        return !this.spin.state && this.vel.value > 0;
    }

    turnRight() {
        this.angle += 0.01;
        this.rotor.rotation.y += 0.01;
        this.vel.vector.x = Math.sin(this.angle) * this.vel.value;
        this.vel.vector.z = -Math.cos(this.angle) * this.vel.value;
    }

    turnLeft() {
        this.angle -= 0.01;
        this.rotor.rotation.y -= 0.01;
        this.vel.vector.x = Math.sin(this.angle) * this.vel.value;
        this.vel.vector.z = -Math.cos(this.angle) * this.vel.value;
    }

    speedUp() {
        if(this.vel.value < this.vel.max) {
            this.vel.value += this.vel.speedUp;
            this.vel.vector.x = Math.sin(this.angle) * this.vel.value;
            this.vel.vector.z = -Math.cos(this.angle) * this.vel.value;
        }
    }

    speedDown() {
        if(this.vel.value > -this.vel.max) {
            this.vel.value -= this.vel.speedUp;
            this.vel.vector.x = Math.sin(this.angle) * this.vel.value;
            this.vel.vector.z = -Math.cos(this.angle) * this.vel.value;
        }
    }

    takeOff() {
        if(this.container.position.y < this.maxPosY) {
            this.container.position.y += 0.5;
        }
    }

    down() {
        if(this.container.position.y > -25) {
            this.container.position.y -= 0.5;
        }
    }

    keyUp() {
        
    }

    setModel() {
        var loader = new FBXLoader();
        var that = this;
        var mesh;
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
                if(child.name == 'wheelFrontLeft') {
                    that.wheels[0] = child;
                }
                if(child.name == 'wheelFrontRight') {
                    that.wheels[1] = child;
                }
                if(child.name == 'wheelBackLeft') {
                    that.wheels[2] = child;
                }
                if(child.name == 'wheelBackRight') {
                    that.wheels[3] = child;
                }
                if ( child.isMesh ) {
                    child.castShadow = true;
                }
            } );
            mesh = object;
            mesh.rotation.y = Math.PI/2;
            mesh.position.y = 10;
            that.bus.add( mesh );
        } );
    }

}

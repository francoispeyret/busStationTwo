import * as THREE from "three";

export default class Bus {
    constructor(_options) {

        this.container = new THREE.Object3D()

        this.setShadow();
        this.setPosition();
        this.setBase();
        this.setWheels();
    }

    setPosition() {
        this.container.position.set(0,2, 0)
    }

    setShadow() {
        this.container.castShadow = true; //default is false
        this.container.receiveShadow = true; //default
    }

    setBase() {

        var busGeometry = new THREE.BoxGeometry( 3, 3, 9 );
        var busMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
        var mesh = new THREE.Mesh( busGeometry, busMaterial );


        mesh.castShadow = true;

        this.base = {}
        this.base.object = mesh


        this.container.add(this.base.object)

    }

    setWheels() {

    }


    turnLeft() {
        this.container.position.add({x:-.05,y:0,z:0});
    }
    turnRight() {
        this.container.position.add({x:.05,y:0,z:0});
    }
}

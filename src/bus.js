import * as THREE from "three";

export default class Bus {
    constructor() {
        var busGeometry = new THREE.BoxGeometry( 1, 1, 3 );
        var busMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
        this.mesh = new THREE.Mesh( busGeometry, busMaterial );
        this.mesh.position.set( 0, .5, 2 );
        this.mesh.castShadow = true; //default is false
        this.mesh.receiveShadow = false; //default
    }
}

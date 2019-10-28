import * as THREE from "three";

export default class Camera {
    constructor() {
        this.c = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 3000 );
        this.c.position.set(0,350,450);
        this.c.lookAt(new THREE.Vector3(0,0,0));
    }
}

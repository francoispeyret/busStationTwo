import * as THREE from "three";

export default class Objects {
    constructor(_options) {

        // set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
    }
}

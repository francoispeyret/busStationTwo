import * as THREE from "three";

export default class Scene {
    constructor() {
        this.s = new THREE.Scene();
        this.s.fog = new THREE.Fog( 0xc2f8ff, 1400, 1400 );
    }

    animate(sun) {
        
    }
}

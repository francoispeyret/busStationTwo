import * as THREE from "three";

export default class Camera {
    constructor() {
        this.c = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 10000 );
        this.offset = new THREE.Vector3(12,12,12);
        
        this.c.position.set(this.offset.x,this.offset.y,this.offset.z);
        this.c.rotation.x = Math.PI/2;
        this.c.lookAt(new THREE.Vector3(0,0,0));
    }

    updatePosition(bus) {
        const newPos = {
            x: bus.container.position.x + this.offset.x,
            y: bus.container.position.y + this.offset.y,
            z: bus.container.position.z + this.offset.z
        };
        this.c.rotation.z = Math.PI*0.85;
        this.c.position.set(newPos.x, newPos.y, newPos.z) 
    }
}

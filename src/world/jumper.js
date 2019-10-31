import * as THREE from "three";

export default class Jumper {
    constructor() {
        this.container = new THREE.Object3D();
        this.size = {
            w: 90
        }
        this.setMesh();
        this.reset();

    }

    setMesh() {
        let meshGem = new THREE.BoxBufferGeometry(this.size.w,30,66);
        let meshMat = new THREE.MeshPhongMaterial( { color: 0xfcd703 } );
        let puddle = new THREE.Mesh( meshGem, meshMat );
        puddle.receiveShadow = true;
        puddle.rotation.x = Math.PI / 8;
        this.container.add(puddle);

    }

    reset() {
        const randomPosition = Math.floor(Math.random() * 3) + 1;
        if(randomPosition === 1) {
            this.container.position.set(0,-23,-1500);
        } else if(randomPosition === 2){
            this.container.position.set(100,-23,-1500);
        } else if(randomPosition === 3){
            this.container.position.set(-100,-23,-1500);
        }
    }

    interact(bus) {
        bus.jump.state = true;
    }

}

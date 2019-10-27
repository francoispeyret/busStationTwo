import * as THREE from "three";

export default class Puddle {
    constructor() {
        this.container = new THREE.Object3D();
        this.setMesh();
        this.reset();
        this.size = {
            w: 40
        }

    }

    setMesh() {
        let meshGem = new THREE.CircleBufferGeometry(30,16);
        let meshMat = new THREE.MeshPhongMaterial( { color: 0x6bdfff } );
        let puddle = new THREE.Mesh( meshGem, meshMat );
        puddle.receiveShadow = true;
        puddle.rotation.x = -1.5708;
        this.container.add(puddle);

        let mesh2Gem = new THREE.CircleBufferGeometry(13,16);
        let puddle2 = new THREE.Mesh( mesh2Gem, meshMat );
        puddle2.receiveShadow = true;
        puddle2.rotation.x = -1.5708;
        puddle2.position.set(-22,0,-22);
        this.container.add(puddle2);
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
        bus.spin.state = true;
    }

}

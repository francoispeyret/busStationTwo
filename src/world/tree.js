import * as THREE from "three";

export default class Tree {
    constructor(v3,i) {
        this.i  = i;
        this.v3 = v3;

        this.init(this.v3,this.i);
    }

    init(v3,i) {
        let treeBranchGem = new THREE.ConeBufferGeometry( 10, 40, 8 );
        let treeBranchMat = new THREE.MeshPhongMaterial( { color: 0x328c25 } );
        treeBranchMat.flatShading = true;
        let treeBranch = new THREE.Mesh( treeBranchGem, treeBranchMat );
        treeBranch.castShadow = true;
        treeBranch.position.set(0,30,0)

        let treeTrunkGem = new THREE.CylinderBufferGeometry( 3, 3, 20, 6 );
        let treeTrunkMat = new THREE.MeshPhongMaterial( { color: 0x8c7050 } )
        treeTrunkMat.flatShading = true;
        let treeTrunk = new THREE.Mesh( treeTrunkGem, treeTrunkMat );
        treeTrunk.castShadow = true;
        treeTrunk.receiveShadow = true;
        treeTrunk.position.set(0,0,0)

        this.object = new THREE.Object3D();
        this.object.add(treeBranch);
        this.object.add(treeTrunk);


        const random = {
            x: Math.random() * 100 - 50
        }

        if(i % 2 == 1) {
            this.object.position.set(-250 + random.x,-15,i*100 - 1450);
        } else {
            this.object.position.set(250 + random.x,-15,i*100 - 1450);
        }
    }

    animate() {

    }

}

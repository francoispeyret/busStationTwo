import * as THREE from "three";
import Tree from "./tree.js";

export default class Objects {
    constructor(_options) {

        this.time = 0;

        // set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        // Objects
        this.tirets = [];
        this.trees  = [];

        this.setGrass();
        this.setRoad();
        this.setTirets();
        this.setTrees();
    }

    setGrass() {
        let grassGem = new THREE.PlaneBufferGeometry( 1800, 1500, 50, 50 );
        let grassMat = new THREE.MeshPhongMaterial( { color: 0xafff45 } );
        let grass = new THREE.Mesh( grassGem, grassMat );
        grass.receiveShadow = true;
        grass.castShadow = true;
        grass.rotation.x = -1.5708;
        grass.position.set(0,-25,-400);

        this.container.add(grass);
    }

    setRoad() {
        let roadGem = new THREE.PlaneBufferGeometry( 300, 1500 );
        let roadMat = new THREE.MeshPhongMaterial( { color: 0x333333 } );
        let road = new THREE.Mesh( roadGem, roadMat );
        road.receiveShadow = true;
        road.position.set(0,-24,-400);
        road.rotation.x = -1.5708;

        this.container.add(road);
    }

    setTirets() {
        let tiretGem = new THREE.PlaneBufferGeometry( 3, 1500 );
        let tiretMat = new THREE.MeshPhongMaterial( { color: 0xfff428 } );
        let tiret = new THREE.Mesh( tiretGem, tiretMat );
        tiret.receiveShadow = true;
        tiret.position.set(-145,-23,-400);
        tiret.rotation.x = -1.5708;

        let tiret2 = new THREE.Mesh( tiretGem, tiretMat );
        tiret2.receiveShadow = true;
        tiret2.position.set(145,-23,-400);
        tiret2.rotation.x = -1.5708;

        this.container.add(tiret);
        this.container.add(tiret2);

        let tiretsGem = new THREE.PlaneBufferGeometry( 4, 30 );
        let tiretsMat = new THREE.MeshPhongMaterial( { color: 0xffffff } );
        for(let i = 0; i < 60; i++) {
            this.tirets[i] = new THREE.Mesh( tiretsGem, tiretsMat );
            this.tirets[i].rotation.x = -1.5708;
            this.tirets[i].receiveShadow = true;
            if(i % 2 == 1) {
                this.tirets[i].position.set(-50,-23,i*50 - 1450);
            } else {
                this.tirets[i].position.set(50,-23,i*50 - 1500);
            }
            this.container.add(this.tirets[i]);
        }
    }


    setTrees() {
        for(let i = 0; i < 15; i++) {
            this.trees[i] = new Tree('pos',i);
            this.container.add(this.trees[i].object);
        }
    }

    animate(vel) {
        this.time++;
        for(let i = 0; i < 60; i++) {
            this.tirets[i].position.add({x:0,y:0,z:vel})
            if(this.tirets[i].position.z > 400) {
                if(i % 2 == 1) {
                    this.tirets[i].position.set(-50,-23,-1450);
                } else {
                    this.tirets[i].position.set(50,-23,-1500);
                }
            }
        }
        for(let i = 0; i < 15; i++) {
            this.trees[i].object.position.add({x:0,y:0,z:vel})
            if(this.trees[i].object.position.z > 400) {
                const random = {
                    x: Math.random() * 100 - 50
                }
                if(i % 2 == 1) {
                    this.trees[i].object.position.set(-250 + random.x,-15,-1450);
                } else {
                    this.trees[i].object.position.set(250 + random.x,-15,-1500);
                }
            }
        }
    }
}

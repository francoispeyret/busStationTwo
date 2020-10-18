import * as THREE from 'three';
import Puddle from '../world/puddle.js';
import Jumper from '../world/jumper.js';

export default class Spawner {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();

        this.objects = [];
        this.objects[0] = new Puddle();
        this.objects[1] = new Jumper();

        for(let i = 0; i < this.objects.length; i++) {
            this.scene.add(this.objects[i].container);
        }
    }

    animate(bus) {
    }

    colision(bus, object) {
        if( object.container.position.z < bus.size.d / 2 && object.container.position.z > -bus.size.d / 2) {
            if(
                object.container.position.x + object.size.w /2 > bus.container.position.x - bus.size.w/2 &&
                object.container.position.x - object.size.w /2  < bus.container.position.x + bus.size.w/2
            ) {
                return true;
            }
        }
        return false;
    }

}

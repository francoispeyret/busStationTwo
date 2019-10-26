import * as THREE from 'three';
import Puddle from '../world/puddle.js';

export default class Spawner {
    constructor(scene) {
        this.scene = scene;
        this.clock = new THREE.Clock();

        this.objects = [];
        this.objects[0] = new Puddle();

        for(let i = 0; i < this.objects.length; i++) {
            this.scene.add(this.objects[i].container);
        }
    }

    animate(bus) {
        for(let i = 0; i < this.objects.length; i++) {
            this.objects[i].container.position.add({x:0,y:0,z:bus.vel.value});

            if(this.colision(bus, this.objects[i]) == true) {
                this.objects[i].interact(bus);
            }

            if(this.objects[i].container.position.z > 400) {
                this.objects[i].reset();
            }
        }
    }

    colision(bus, object) {
        if( object.container.position.z < bus.size.d / 2 && object.container.position.z > -bus.size.d / 2) {
            if(
                object.container.position.x > bus.container.position.x - bus.size.w/2 &&
                object.container.position.x < bus.container.position.x + bus.size.w/2
            ) {
                return true;
            }
        }
        return false;
    }

}

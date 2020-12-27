import * as THREE from 'three';

export default class Sun {
    constructor() {

        this.animationClock = 0;

        this.light = new THREE.SpotLight( 0xfefefe, 1, 0, Math.PI / 4, 0.3 );
        this.light.position.set( 300, 300, 0 );
        this.light.target.position.set( 0, 0, 0 );
        this.light.castShadow = true;
        this.light.shadow.radius = 2;
        this.light.shadow.camera.near = 1;
        this.light.shadow.camera.far = 600;
        this.light.shadow.bias = 0.0000001;
        this.light.shadow.mapSize.width = 16096;
        this.light.shadow.mapSize.height = 16096;

        this.ambient = new THREE.AmbientLight( 0x115099 );
        this.ambient.intensity = 1;
    }

    animate (bus) {
        this.animationClock += .05;
        let x = -Math.floor(Math.sin(THREE.Math.degToRad(this.animationClock)) * 300);
        let y = Math.floor(Math.cos(THREE.Math.degToRad(this.animationClock)) * 300);
        this.light.position.set(
            bus.container.position.x + x,
            bus.container.position.y + y,
            bus.container.position.z + 300
            );
        this.light.target = bus.container;
    }
}

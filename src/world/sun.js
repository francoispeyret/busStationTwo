import * as THREE from 'three';

export default class Sun {
    constructor() {

        this.animationClock = 0;

        this.light = new THREE.SpotLight( 0xfefefe, 1, 0, Math.PI / 4, 0.3 );
        this.light.position.set( 1500, 1500, 0 );
        this.light.target.position.set( 0, 0, 0 );
        this.light.castShadow = true;
        this.light.shadow.radius = 0.5;
        this.light.shadow.camera.near = 50;
        this.light.shadow.camera.far = 2500;
        this.light.shadow.bias = 0.0001;
        this.light.shadow.mapSize.width = 4096;
        this.light.shadow.mapSize.height = 4096;

        this.ambient = new THREE.AmbientLight( 0x115099 );
        this.ambient.intensity = 0.5;
    }

    animate () {
        if(this.light.position.y > -300 && this.light.position.y < 750) {
            this.animationClock += .3;
        } else if(this.light.position.y > 500) {
            this.animationClock += .05;
        } else {
            this.animationClock += .15;
        }
        let x = -Math.floor(Math.sin(THREE.Math.degToRad(this.animationClock)) * 1500);
        let y = Math.floor(Math.cos(THREE.Math.degToRad(this.animationClock)) * 1500);
        this.light.position.set( x, y, 0 );
    }
}

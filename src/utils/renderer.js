import * as THREE from "three";

export default class Renderer {
    constructor() {
        this.r = new THREE.WebGLRenderer();
        this.r.setClearColor(0x66c1d4, 1);
        this.r.setPixelRatio(1);
        this.r.toneMapping = THREE.ACESFilmicToneMapping;
        this.r.gammaOutPut = true;
        this.r.shadowMap.enabled = true;
        this.r.shadowMap.type = THREE.PCFShadowMap;
        this.r.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.r.domElement );
    }
}

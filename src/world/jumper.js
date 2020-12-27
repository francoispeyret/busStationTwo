import * as THREE from "three";
import * as CANNON from 'cannon-es';

export default class Jumper {
    constructor(road, cannon, position, quaternion) {
        this.road = road;
        this.cannon = cannon;
        this.position = position;
        this.quaternion = quaternion;
        this.model = null;
        this.body = null;

        this.init();
    }

    init() {
        var jumberModel = new THREE.BoxGeometry(8, 8, 2);
        var jumberMaterial = new THREE.MeshPhongMaterial( {color: 0xf9f9f9} );
        this.model = new THREE.Mesh(jumberModel, jumberMaterial);
        this.model.castShadow = true;
        this.model.receiveShadow = true;

        this.road.add(this.model);
        
        var jumperShape = new CANNON.Box(new CANNON.Vec3(4, 4, 1));
        this.body =  new CANNON.Body({
            mass: 0,
            position: this.position,
            allowSleep: true
        });
        
        this.body.addShape(jumperShape);
        var q1 = new CANNON.Quaternion();
        var q2 = new CANNON.Quaternion();
        q1.setFromAxisAngle(this.quaternion.vec, this.quaternion.val);
        q2.setFromAxisAngle(new CANNON.Vec3(1,0,0), Math.PI/12);
        var quaternion = q1.mult(q2);
        quaternion.normalize();

        this.body.quaternion = quaternion;
        //this.body.quaternion.setFromAxisAngle(this.quaternion.vec, this.quaternion.val);
        //this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), Math.PI/12);
        this.cannon.world.addBody(this.body);

        this.model.position.copy(this.body.position);
        this.model.quaternion.copy(this.body.quaternion);
    }

    reset() {
        
    }

}

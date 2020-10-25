import * as THREE from "three";
import Tree from "./tree.js";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from 'cannon';

export default class Objects {
    constructor(cannon) {

        this.time = 0;
        this.cannon = cannon;

        // set up
        this.container = new THREE.Object3D();
        this.base = new THREE.Object3D()
        this.base.matrixAutoUpdate = false;
        this.container.add(this.base);

        // Objects
        this.tirets = [];
        this.trees  = [];


        this.setModel();

        this.bodies = [];
    }

    
    setModel() {
        var loader = new FBXLoader();
        var that = this;
        loader.load( './models/map.fbx', function ( object ) {
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
                if( child.name.indexOf('tree') > -1) {
                  that.addModelToBodyCannon(child)
                }
            } );
            that.container.add( object );
        } );
    }

    addModelToBodyCannon(model) {
        let body;
        if(model.name.indexOf('tree') > -1) {
            body =  new CANNON.Body({
                mass: 100000, // kg
                position: new CANNON.Vec3(model.position.x, 120, model.position.z), // m
                shape: new CANNON.Cylinder(30, 30, 120, 6),
                allowSleep: true,
                sleepSpeedLimit: 0.5,
            });
            body.sleep();
        }
        if(body) {
            this.bodies.push({
                body: body,
                model:  model
            });
            this.cannon.world.addBody(body)
        }
    }

    animate(bus) {
        this.time++;
        for(let body of this.bodies) {
            if(bus.container.position.distanceTo(body.model.position) < 1000 ) {
                body.body.wakeUp();
                body.model.quaternion.copy(body.body.quaternion);
                body.model.position.copy(body.body.position);
            } else {
                body.body.sleep();
            }
        }
    }
}

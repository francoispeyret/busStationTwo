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
                mass: 100, // kg
                position: new CANNON.Vec3(model.position.x, 15, model.position.z), // m
                shape: new CANNON.Cylinder(10, 5, 30, 6),
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
                body.model.quaternion._w = body.body.quaternion.w;
                body.model.quaternion._x = body.body.quaternion.x;
                body.model.quaternion._y = body.body.quaternion.y;
                body.model.quaternion._z = body.body.quaternion.z;
                body.model.position.x = body.body.position.x;
                body.model.position.y = body.body.position.y;
                body.model.position.z = body.body.position.z; 
            } else {
                body.body.sleep();
            }
        }
    }
}

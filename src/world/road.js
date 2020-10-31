import * as THREE from "three";
import Tree from "./tree.js";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from 'cannon-es';

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
        loader.load( './models/map2.fbx', function ( object ) {
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
            let options;
            if(model.name.indexOf('normal') > -1) {
                options = {
                    mass: 10000,
                    height: 160,
                    width: 50
                }
            } else if (model.name.indexOf('big') > -1) {
                options = {
                    mass: 30000,
                    height: 250,
                    width: 80
                }
            } else {
                options = {
                    mass: 10000,
                    height: 160,
                    width: 50
                }
            }

            body =  new CANNON.Body({
                mass: options.mass, // kg
                position: new CANNON.Vec3(model.position.x, options.height/2, model.position.z), // m
                shape: new CANNON.Cylinder(options.width*.5, options.width, options.height, 12),
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

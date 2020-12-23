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
        loader.load( './models/map4.fbx', function ( object ) {
            object.position.z = 0;
            //object.rotation.x = Math.PI/2;
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
                that.addModelToBodyCannon(child)
            } );
            that.container.add( object );
        } );
    }

    addModelToBodyCannon(model) {
        let body;
        if(model.name.indexOf('tree') > -1) {
            let options;
            if (model.name.indexOf('big') > -1) {
                options = {
                    mass: 300,
                    height: 9,
                    width: 2.5
                }
            } else {
                options = {
                    mass: 150,
                    height: 5,
                    width: 1.5
                }
            }
            body =  new CANNON.Body({
                mass: options.mass, // kg
                position: new CANNON.Vec3(model.position.x,model.position.y, options.height/2), // m
                allowSleep: true,
                sleepSpeedLimit: 0.5,
            });
            //model.rotation.z = Math.PI;
            var shape = new CANNON.Cylinder(0, options.width, options.height, 12);
            var q = new CANNON.Quaternion()
            q.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), 0);
            body.addShape(shape, new CANNON.Vec3(0, 1, 0));
            body.addShape(new CANNON.Cylinder(0.76, 0.76, 1, 6), new CANNON.Vec3(0,-options.height/2+1,0))
            body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI/2);
            body.sleep();
        }

        if(model.name.indexOf('rock002') > -1) {
            body =  new CANNON.Body({
                mass: 0, // kg
                position: new CANNON.Vec3(model.position.x,model.position.y, 0), // m
                allowSleep: true,
                sleepSpeedLimit: 0.5,
            });
            body.addShape(new CANNON.Cylinder(2, 2, 3, 6));
            body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI/2);
        }
        if(model.name.indexOf('rock008') > -1) {
            body =  new CANNON.Body({
                mass: 0, // kg
                position: new CANNON.Vec3(model.position.x,model.position.y, 0), // m
                allowSleep: true,
                sleepSpeedLimit: 0.5,
            });
            body.addShape(new CANNON.Cylinder(1.5, 1.5, 2, 6));
            body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI/2);
        }

        if(model.name.indexOf('ballon') > -1) {
            body =  new CANNON.Body({
                mass: 2, // kg
                position: new CANNON.Vec3(model.position.x,model.position.y, model.position.z + 5), // m
                allowSleep: true,
                sleepSpeedLimit: 0.5,
            });
            body.addShape(new CANNON.Sphere(0.76));
            body.linearDamping = 0; 
            body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 1, 0), Math.PI/2);
        }
        if(model.name.indexOf('cage') > -1) {
            let barres =  new CANNON.Body({
                mass: 0, // kg
                position: new CANNON.Vec3(model.position.x,model.position.y, model.position.z - 0.75 ), // m
                allowSleep: true,
            });
            let barreShapeCoord = new CANNON.Vec3(0.25, 0.25, 2.5);
            barres.addShape(new CANNON.Box(barreShapeCoord));
            barres.addShape(new CANNON.Box(barreShapeCoord), new CANNON.Vec3(-11.8,.5, 0));
            barres.linearDamping = 0; 
            this.cannon.world.addBody(barres);
        }


        if(body) {
            model.rotation.x = Math.PI/2;
            body.sleepSpeedLimit = 0.5;
            body.sleepTimeLimit  = 1;
            this.bodies.push({
                body: body,
                model: model
            });
            this.cannon.world.addBody(body)
        }
    }

    animate(bus) {
        this.time++;
        for(let tree of this.bodies) {
            if(bus.container.position.distanceTo(tree.model.position) < 30 ) {
                tree.body.wakeUp();
            } else if(tree.body.sleepState === 0){
                tree.body.sleep();
            }
            tree.model.quaternion.copy(tree.body.quaternion);
            tree.model.position.copy(tree.body.position);
        }
    }
}

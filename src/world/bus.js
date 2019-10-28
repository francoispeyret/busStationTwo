import * as THREE from "three";

export default class Bus {
    constructor(_options) {

        this.time = 0;

        this.size = {
            w: 70,
            d: 160,
            h: 55
        }

        this.angle = 0;
        this.angleDelta = 0.1;

        this.maxPosX = 150;

        this.vel = {
            value: 0,
            speedUp: .05,
            max: 15
        }

        this.container = new THREE.Object3D()
        this.container.castShadow = true;
        this.container.receiveShadow = true;
        this.container.position.z = 50;

        this.spin = {
            state: false,
            animation: 0,
            angle: 0,
        };

        this.break = {
            state: false,
            mat: null,
        };

        this.spots = {
            intensity: 1.5
        }

        this.setBase();
        this.setWheels();
    }

    animate(sun) {
        this.time++;
        if(this.vel.value > 0) {
            if(this.spin.state === true) {
                this.spin.angle += 10;
                if(this.spin.angle > 360) {
                    this.spin.angle = 0;
                    this.spin.state = false;
                }
                this.container.rotation.y = THREE.Math.degToRad(this.angle*2 + this.spin.angle);
            } else {
                if(this.angle > 0 || this.angle < 0 ) {
                    if(this.angle > 0) {
                        this.angle -= this.angleDelta;
                    } else {
                        this.angle += this.angleDelta;
                    }
                }
                this.angle = Math.round(this.angle*10)*.1;
                this.container.rotation.y = THREE.Math.degToRad(this.angle*2);
            }
        }


        if((this.container.position.x < this.maxPosX || this.angle > 0) &&
           (this.container.position.x > -this.maxPosX || this.angle < 0 )) {
            this.container.position.add({x:-this.angle*(this.vel.value/10),y:0,z:0});
        }


        this.base.rotation.z = Math.sin(this.time*-this.vel.value/20)/75;

        for(let i = 0; i < 6; i++) {
            if(i === 2 || i === 5) {
                this.wheels[i].rotation.y = THREE.Math.degToRad((this.angle*2)-90);
            }
            this.wheels[i].rotation.z += this.vel.value / 30;
        }
        if(this.break.state == true) {
            this.break.mat.emissive = new THREE.Color( 0xFF0000 );
        } else {
            this.break.mat.emissive = new THREE.Color( 0x770000 );;
        }

        if(sun.light.position.y > 300) {
            this.spots.spot1.intensity = 0.1;
            this.spots.spot2.intensity = 0.1;
        } else {
            this.spots.spot1.intensity = 1.5;
            this.spots.spot2.intensity = 1.5;
        }
    }

    canTurn() {
        return !this.spin.state && this.vel.value > 0;
    }

    turnRight() {
        if(this.container.position.x < this.maxPosX && this.canTurn()) {
            if(this.angle > -7) {
                this.angle -= this.angleDelta;
            }
        }
    }

    turnLeft() {
        if(this.container.position.x > -this.maxPosX && this.canTurn()) {
            if(this.angle < 7) {
                this.angle += this.angleDelta;
            }
        }
    }

    setBase() {
        this.base = new THREE.Object3D();

            let busBufferGeometry = new THREE.BoxBufferGeometry( 60, 45, 160 );
            let busMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );
            let chassis = new THREE.Mesh( busBufferGeometry, busMaterial );
            chassis.castShadow = true;
            chassis.position.set(0,20,0);
            this.base.add(chassis);


            let lampTarget = new THREE.Object3D();
            lampTarget.position.set(0, 0, -160);
            this.base.add(lampTarget);

            let headlampGem = new THREE.BoxBufferGeometry( 10, 5, 2 );
            let headlampMat = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, emissive: 0xAAAAAA} );

            let headlamp1 = new THREE.SpotLight( 0xffffff, 1.5, 500, Math.PI / 2, 0.4, 1 );
            headlamp1.position.set( 25, 0, -80 );
            headlamp1.target = lampTarget;
            headlamp1.castShadow = true;
            this.spots.spot1 = headlamp1;
            this.base.add(headlamp1);
            let headLampMesh1 = new THREE.Mesh( headlampGem, headlampMat );
            headLampMesh1.position.set( 22, 1, -81 );
            this.base.add(headLampMesh1);

            let headlamp2 = new THREE.SpotLight( 0xffffff, 1.5, 500, Math.PI / 2, 0.4, 1 );
            headlamp2.position.set( -25, 0, -80 );
            headlamp2.target = lampTarget;
            headlamp2.castShadow = true;
            this.spots.spot2 = headlamp2;
            this.base.add(headlamp2);
            let headLampMesh2 = new THREE.Mesh( headlampGem, headlampMat );
            headLampMesh2.position.set( -22, 1, -81 );
            this.base.add(headLampMesh2);


            let stopTarget = new THREE.Object3D();
            stopTarget.position.set(0, 0, 160);
            this.base.add(stopTarget);


            let stoplampBufferGeometry = new THREE.BoxBufferGeometry( 5, 12, 1 );
            let stoplampBufferMat = new THREE.MeshPhongMaterial( { color: 0xFF0000, emissive: 0x770000} );
            this.break.mat = stoplampBufferMat;

            let stoplamp1 = new THREE.PointLight( 0xFF0000, 1, 70);
            stoplamp1.position.set( 30, 20, 70 );
            stoplamp1.target = stopTarget;
            this.base.add(stoplamp1);
            let stoplamp1BufferMat = new THREE.MeshPhongMaterial( { color: 0xFF0000, emissive: 0x990000} );
            let stoplamp1Mesh = new THREE.Mesh(stoplampBufferGeometry, stoplampBufferMat);
            stoplamp1Mesh.position.set( 27, 20, 80 );
            this.base.add(stoplamp1Mesh);

            let stoplamp2 = new THREE.PointLight( 0xFF0000, 1, 70);
            stoplamp2.position.set( -30, 20, 70 );
            stoplamp2.target = stopTarget;
            this.base.add(stoplamp2);
            let stoplamp2Mesh = new THREE.Mesh(stoplampBufferGeometry, stoplampBufferMat);
            stoplamp2Mesh.position.set( -27, 20, 80 );
            this.base.add(stoplamp2Mesh);


            let exhaustGem = new THREE.CylinderBufferGeometry( 2, 2, 15, 8, 1, true );
            let exhaustMat = new THREE.MeshPhongMaterial( { color: 0x777777 } );
            exhaustMat.flatShading = true;
            let exhaust = new THREE.Mesh( exhaustGem, exhaustMat );
            exhaust.receiveShadow = true;
            exhaust.castShadow = true;
            exhaust.rotation.x = -1.5708;
            exhaust.position.set(-22, -12, 70);
            this.base.add(exhaust);

            let brandColor = new THREE.MeshPhongMaterial( { color: 0xee1111 } );

            let brandBackGem = new THREE.BoxBufferGeometry( 1, 60, 10 );

            let brandBack = new THREE.Mesh(brandBackGem, brandColor);
            brandBack.receiveShadow = true;
            brandBack.castShadow = true;
            brandBack.rotation.z = 1.5708;
            brandBack.rotation.x = 1.5708;
            brandBack.position.set(0, 35.5, 80.5);
            this.base.add(brandBack);

            let brandFront = new THREE.Mesh(brandBackGem, brandColor);
            brandFront.receiveShadow = true;
            brandFront.castShadow = true;
            brandFront.position.set(0, 35.5, -80.5);
            brandFront.rotation.z = 1.5708;
            brandFront.rotation.x = 1.5708;
            this.base.add(brandFront);

            let brandLateralGem = new THREE.BoxBufferGeometry( 162, 1, 10 );

            let brandLeft = new THREE.Mesh(brandLateralGem, brandColor);
            brandLeft.receiveShadow = true;
            brandLeft.castShadow = true;
            brandLeft.position.set(-30.5, 35.5, 0);
            brandLeft.rotation.x = 1.5708;
            brandLeft.rotation.z = 1.5708;
            this.base.add(brandLeft);

            let brandRight = new THREE.Mesh(brandLateralGem, brandColor);
            brandRight.receiveShadow = true;
            brandRight.position.set(30.5, 35.5, 0);
            brandRight.rotation.x = 1.5708;
            brandRight.rotation.z = 1.5708;
            this.base.add(brandRight);

        this.container.add(this.base);

    }

    setWheels() {
        this.wheels = [];
        for(let i = 0; i < 6; i++) {
            this.wheels[i] = new THREE.Object3D();
            this.wheels[i].rotation.y = -1.5708;

            let tyreGem = new THREE.TorusBufferGeometry( 10, 4.7, 6, 28 );
            let tyreMat = new THREE.MeshPhongMaterial( { color: 0x222222 } );
            tyreMat.flatShading = true;

            let tyre = new THREE.Mesh( tyreGem, tyreMat );
            tyre.receiveShadow = true;
            tyre.castShadow = true;
            this.wheels[i].add(tyre);

            let rimGem = new THREE.CylinderBufferGeometry( 4, 6, 3, 5 );
            let rimMat = new THREE.MeshPhongMaterial( { color: 0xcccccc } );
            rimMat.flatShading = true;

            let rim = new THREE.Mesh( rimGem, rimMat );
            rim.receiveShadow = true;
            rim.castShadow = true;
            if(i < 3) {
                rim.position.set(0, 0, -3);
                rim.rotation.x = -1.5708;
            } else {
                rim.position.set(0, 0, 3);
                rim.rotation.x = 1.5708;
            }
            this.wheels[i].add(rim);


            if(i === 0) {
                this.wheels[i].position.set(29, -5, 60);
            } else if(i === 1) {
                this.wheels[i].position.set(29, -5, 30);
            } else if(i === 2) {
                this.wheels[i].position.set(29, -5, -60);
            }
            if(i === 3) {
                this.wheels[i].position.set(-29, -5, 60);
            } else if(i === 4) {
                this.wheels[i].position.set(-29, -5, 30);
            } else if(i === 5) {
                this.wheels[i].position.set(-29, -5, -60);
            }

            this.container.add(this.wheels[i]);
        }
    }

    speedUp() {
        if(this.vel.value < this.vel.max) {
            this.vel.value += this.vel.speedUp;
        }
    }

    speedDown() {
        this.break.state = true;
        if(this.vel.value > 0) {
            this.vel.value -= this.vel.speedUp;
            if(this.vel.value <= 0) {
                this.vel.value = 0;
            }
        }
    }

    keyUp() {
        this.break.state = false;
    }
}

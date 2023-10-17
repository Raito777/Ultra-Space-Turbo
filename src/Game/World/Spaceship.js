import * as THREE from "three";
import * as CANNON from "cannon-es";

import Game from "../Game.js";

let instanceSpaceShip = null;

export default class Spaceship {
  constructor() {
    if (instanceSpaceShip) {
      console.log(instanceSpaceShip);
      return instanceSpaceShip;
    }
    instanceSpaceShip = this;

    this.game = new Game();
    this.scene = this.game.scene;
    this.resources = this.game.resources;
    // Setup
    this.position = 0;
    // let previousMouseX = 0;
    // let spaceshipRotation = 0;
    // Contrôle de la souris
    // document.addEventListener("mousemove", (event) => {
    //   const mouseX = event.clientX;
    //   const mouseDeltaX = mouseX - previousMouseX;
    //   spaceshipRotation += mouseDeltaX / 100; // Ajustez la sensibilité à la souris selon vos besoins
    //   previousMouseX = mouseX;
    //   console.log(mouseDeltaX);
    // });
  }

  setModel() {
    this.world = this.game.world;
    this.resource = this.resources.items.spaceshipModel;
    this.model = this.resource.scene;
    this.model.position.set(0, 0, 0);
    console.log(this.model.position);
    this.position = this.model.position;
    this.model.rotation.y = Math.PI * 0.5;
    // this.model.scale.set(0.02, 0.02, 0.02);

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(4.5, 2, 5.5));

    this.body = new CANNON.Body({
      mass: 5,
      position: new CANNON.Vec3(0, 3, 0),
      shape: shape,
      material: this.game.defaultMaterial,
    });

    this.body.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * 0.5
    );

    console.log(this.world);

    this.body.position.copy(this.position);
    this.game.physicWorld.addBody(this.body);

    // body.addEventListener("collide", playHitSound);
    // Save in objects to update
    this.world.objectsToUpdate.push({
      mesh: this.model,
      body: this.body,
    });

    this.scene.add(this.model);

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00, // Couleur verte (en hexadécimal)
      wireframe: true,
    });

    this.debug = this.game.debug;

    this.model.traverse((child) => {
      if (child.isMesh) {
        this.spaceshipMaterial = child.material;
        this.spaceShipTextures = this.spaceshipMaterial;
      }
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  update() {}
}

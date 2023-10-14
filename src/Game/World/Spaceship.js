import * as THREE from "three";

import Game from "../Game.js";

export default class Spaceship {
  constructor() {
    this.game = new Game();
    this.scene = this.game.scene;
    this.resources = this.game.resources;

    // Setup
    this.resource = this.resources.items.spaceshipModel;
    this.setModel();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.position.set(0, 0, 0);
    this.model.rotation.y = Math.PI;
    console.log(this.model.position);
    // this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }
}

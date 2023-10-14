import * as THREE from "three";

import Game from "../Game.js";

export default class Asteroid {
  constructor() {
    this.game = new Game();
    this.scene = this.game.scene;
    this.resources = this.game.resources;

    // Setup
    // this.resource = this.resources.items.spaceshipModel;
    this.setModel();
  }

  setModel() {
    // Test mesh
    this.sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 32),
      new THREE.MeshStandardMaterial({ wireframe: false })
    );
    this.scene.add(this.sphereMesh);
  }
}

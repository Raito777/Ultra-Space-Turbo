import * as THREE from "three";
import Game from "../Game.js";
import Environment from "./Environment.js";

export default class World {
  constructor() {
    this.game = new Game();
    this.scene = this.game.scene;

    // Test mesh
    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ wireframe: false })
    );
    this.scene.add(testMesh);

    this.environment = new Environment();
  }
}

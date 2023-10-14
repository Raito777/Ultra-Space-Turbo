import * as THREE from "three";
import Game from "../Game.js";
import Environment from "./Environment.js";
import Spaceship from "./Spaceship.js";
import Asteroid from "./Asteroid.js";

export default class World {
  constructor() {
    this.objectsToUpdate = [];
    this.game = new Game();
    this.scene = this.game.scene;
    this.resources = this.game.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.spaceship = new Spaceship();
      this.asteroid = new Asteroid();
      this.environment = new Environment();
      console.log(this.objectsToUpdate);
    });
  }

  update() {
    this.game.physicWorld.step(1 / 60, this.game.time.delta, 3);

    for (const object of this.objectsToUpdate) {
      object.mesh.position.copy(object.body.position);
      object.mesh.quaternion.copy(object.body.quaternion);
    }
  }
}

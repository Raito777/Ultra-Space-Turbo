import * as THREE from "three";
import * as CANNON from "cannon-es";
import Game from "../Game.js";
import { getRandomFloat } from "../Utils/functions.js";

export default class Asteroid {
  constructor(radius, position) {
    this.game = new Game();
    this.scene = this.game.scene;
    this.resources = this.game.resources;
    this.world = this.game.world;

    // Setup
    // this.resource = this.resources.items.spaceshipModel;

    this.create(radius, position);
  }

  create(radius, position, rotation) {
    this.position = position;
    var model = this.world.asteroidsModel.clone();
    // Définissez une rotation aléatoire autour de l'axe Y
    model.rotation.set(rotation);
    // model.rotation.set(rotation);
    model.scale.set(radius, radius, radius);
    model.position.copy(position);

    this.scene.add(model);

    // Cannon.js body
    const shape = new CANNON.Sphere(radius * 1.2);

    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: shape,
      material: this.game.defaultMaterial,
    });

    this.body.position.copy(position);
    this.game.physicWorld.addBody(this.body);

    // body.addEventListener("collide", playHitSound);

    // Save in objects to update
    this.world.objectsToUpdate.push({
      mesh: model,
      body: this.body,
    });
  }
}

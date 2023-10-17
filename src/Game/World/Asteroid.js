import * as THREE from "three";
import * as CANNON from "cannon-es";
import Game from "../Game.js";

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

  create(radius, position) {
    this.position = position;

    const mesh = new THREE.Mesh(
      this.world.sphereGeometry,
      this.world.sphereMaterial
    );
    mesh.scale.set(radius, radius, radius);

    mesh.position.copy(position);
    this.scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Sphere(radius);

    this.body = new CANNON.Body({
      mass: 100,
      position: new CANNON.Vec3(0, 3, 0),
      shape: shape,
      material: this.game.defaultMaterial,
    });

    this.body.position.copy(position);
    this.game.physicWorld.addBody(this.body);

    // body.addEventListener("collide", playHitSound);

    // Save in objects to update
    this.world.objectsToUpdate.push({
      mesh: mesh,
      body: this.body,
    });
  }
}

import * as THREE from "three";
import * as CANNON from "cannon-es";
import Game from "../Game.js";

export default class Asteroid {
  constructor() {
    this.game = new Game();
    this.scene = this.game.scene;
    this.resources = this.game.resources;
    this.world = this.game.world;

    // Setup
    // this.resource = this.resources.items.spaceshipModel;
    this.setModel();
    this.create(1, { x: 0, y: 5, z: 0 });
  }

  setModel() {
    this.sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    this.sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMapIntensity: 0.5,
    });
  }

  create(radius, position) {
    const mesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    mesh.scale.set(radius, radius, radius);

    mesh.position.copy(position);
    this.scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Sphere(radius);

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: shape,
      material: this.game.defaultMaterial,
    });

    body.position.copy(position);
    this.game.physicWorld.addBody(body);

    // body.addEventListener("collide", playHitSound);
    console.log(body);

    // Save in objects to update
    this.world.objectsToUpdate.push({
      mesh: mesh,
      body: body,
    });
  }
}

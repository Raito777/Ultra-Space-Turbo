import * as THREE from "three";
import * as CANNON from "cannon-es";

import Game from "../Game.js";
import Environment from "./Environment.js";
import Spaceship from "./Spaceship.js";
import Asteroid from "./Asteroid.js";
import { getRandomFloat } from "../Utils/functions.js";

export default class World {
  constructor() {
    this.forces = new CANNON.Vec3(0, 0, 3.1);

    this.objectsToUpdate = [];
    this.game = new Game();
    this.scene = this.game.scene;
    this.resources = this.game.resources;
    this.ready = false;
    this.asteroids = [];
    this.spaceship = new Spaceship();

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.spaceship.setModel();
      this.setAsteroidsModel();

      this.environment = new Environment();
      // this.pushAsteroids();

      this.ready = true;
    });

    this.debug = this.game.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("world");

      const debugObject = {};
      debugObject.pushAsteroids = () => {
        this.pushAsteroids();
      };

      this.debugFolder.add(debugObject, "pushAsteroids");
    }

    // Test mesh
    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ wireframe: true })
    );
    this.scene.add(testMesh);
  }

  setAsteroidsModel() {
    this.sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    this.sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMapIntensity: 0.5,
    });
  }

  update() {
    this.game.physicWorld.step(1 / 60, this.game.time.delta, 3);
    this.move();
    this.spaceship.update();
    for (const object of this.objectsToUpdate) {
      object.mesh.position.copy(object.body.position);
      object.mesh.quaternion.copy(object.body.quaternion);
    }
  }

  pushAsteroids() {
    for (let i = 0; i < 100; i++) {
      this.asteroids.push(
        new Asteroid(getRandomFloat(1, 5), {
          x: getRandomFloat(-100, 100),
          y: getRandomFloat(-100, 100),
          z: getRandomFloat(-100, 100),
        })
      );
    }
    // setTimeout(() => this.pushAsteroids(), 100);
  }

  move() {
    this.forces = new CANNON.Vec3(0, 0, 0);

    this.thrust = 500;
    this.rotation = 200;
    this.rollAngle = 100;

    const rollAxis = new CANNON.Vec3(0, 0, 1);

    if (this.game.controls.keys.S) {
      this.forces.y = -1 * this.rotation;
    }

    if (this.game.controls.keys.Z) {
      this.forces.y = 1 * this.rotation;
    }

    if (this.game.controls.keys.Q) {
      // this.forces.x = -1 * this.rotation;
      const rollForce = new CANNON.Vec3(-this.rollAngle, 0, 0);
      const rollQuaternion = new CANNON.Quaternion();
      rollQuaternion.setFromEuler(0, 0, this.rollAngle);
      rollQuaternion.vmult(rollForce, rollForce);
      this.spaceship.body.applyLocalForce(rollForce, new CANNON.Vec3(-1, 0, 0));
    }
    if (this.game.controls.keys.D) {
      // this.forces.x = 1 * this.rotation;
      const rollForce = new CANNON.Vec3(-this.rollAngle, 0, 0);
      const rollQuaternion = new CANNON.Quaternion();
      rollQuaternion.setFromEuler(0, 0, this.rollAngle);
      rollQuaternion.vmult(rollForce, rollForce);
      this.spaceship.body.applyLocalForce(rollForce, new CANNON.Vec3(1, 0, 0));
    }

    if (this.game.controls.keys.Space) {
      this.forces.z = 1 * this.thrust;
    }

    this.spaceship.body.applyLocalForce(this.forces, new CANNON.Vec3(0, 0, -1));
  }
}

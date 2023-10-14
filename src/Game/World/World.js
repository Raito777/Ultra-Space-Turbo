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

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.spaceship = new Spaceship();
      this.setAsteroidsModel();
      for (let i = 0; i < 20; i++) {
        this.asteroids.push(
          new Asteroid(1, {
            x: getRandomFloat(-10, 10),
            y: getRandomFloat(-10, 10),
            z: getRandomFloat(-100, -80),
          })
        );
      }

      this.environment = new Environment();
      this.pushAsteroids();

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
    for (const object of this.objectsToUpdate) {
      object.mesh.position.copy(object.body.position);
      object.mesh.quaternion.copy(object.body.quaternion);
    }
  }

  pushAsteroids() {
    this.asteroids.push(
      new Asteroid(getRandomFloat(1, 5), {
        x: getRandomFloat(-20, 20),
        y: getRandomFloat(-20, 20),
        z: getRandomFloat(-50, -40),
      })
    );

    console.log("push");
    setTimeout(() => this.pushAsteroids(), 100);
  }

  move() {
    // this.velocity = new CANNON.Vec3(0, 0, 0); // Réinitialisez la vitesse
    // this.forces = new CANNON.Vec3(0, 0, 3.1);

    if (this.game.controls.keys.Z) {
      this.forces.y = 3.1;
    }

    if (this.game.controls.keys.S) {
      this.forces.y = -3.1;
    }

    if (this.game.controls.keys.Q) {
      this.forces.x = 3.1;
    }
    if (this.game.controls.keys.D) {
      this.forces.x = -3.1;
    }

    console.log("velocity 1" + this.velocity);

    for (let i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].body.applyLocalForce(
        this.forces,
        new CANNON.Vec3(0, 0, 0)
      );
    }
  }
}

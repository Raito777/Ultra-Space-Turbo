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

    this.thrust = 100;
    this.rotation = 7;
    this.rollAngle = 10;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.spaceship.setModel();
      this.setAsteroidsModel();
      this.asteroids.push(
        new Asteroid(
          100,
          { x: 500, y: 0, z: 0 },
          {
            x: getRandomFloat(-Math.PI * 2, Math.PI * 2),
            y: getRandomFloat(-Math.PI * 2, Math.PI * 2),
            z: getRandomFloat(-Math.PI * 2, Math.PI * 2),
          }
        )
      );
      this.environment = new Environment();
      // this.pushAsteroids();

      this.ready = true;
    });

    this.debug = this.game.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("world");

      this.spawnAsteroids = false;
      this.debugFolder.add(this, "spawnAsteroids");

      this.ControlsFolder = this.debug.ui.addFolder("Controls");

      this.ControlsFolder.add(this, "thrust")
        .min(0)
        .max(500)
        .step(0.1)
        .name("Poussée");

      this.ControlsFolder.add(this, "rotation")
        .min(0)
        .max(50)
        .step(0.1)
        .name("Vitesse plongée");

      this.ControlsFolder.add(this, "rollAngle")
        .min(0)
        .max(30)
        .step(0.1)
        .name("Vitesse Pivotement");

      const debugObject = {};
      debugObject.clearAsteroids = () => {
        console.log("clear");
        for (let i = 1; i < this.objectsToUpdate.length; i++) {
          this.game.physicWorld.removeBody(this.objectsToUpdate[i].body);
          this.game.scene.remove(this.objectsToUpdate[i].mesh);
        }
        this.objectsToUpdate.splice(1, this.objectsToUpdate.length);
        this.asteroids.splice(0, this.asteroids.length);
      };
      this.debugFolder.add(debugObject, "clearAsteroids");
    }

    // Test mesh
    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ wireframe: true })
    );
    this.scene.add(testMesh);
  }

  setAsteroidsModel() {
    this.resourceAsteroid = this.resources.items.asteroidModel;
    this.asteroidsModel = this.resourceAsteroid.scene;
  }

  update() {
    this.game.physicWorld.step(1 / 60, this.game.time.delta, 3);
    this.move();
    this.spaceship.update();
    this.dispawnRadius = 800;
    this.minAsteroids = 200;

    let i = 0;
    for (const object of this.objectsToUpdate) {
      object.mesh.position.copy(object.body.position);
      object.mesh.quaternion.copy(object.body.quaternion);
      if (object.body.position.distanceTo(this.spaceship.position) > 3000) {
        this.objectsToUpdate.splice(i, 1);
        this.asteroids.splice(i, 1);
        this.game.physicWorld.removeBody(object.body);
        this.game.scene.remove(object.mesh);
      }
      i++;
    }
    for (const asteroid of this.asteroids) {
      this.forceThrust = 1;

      // this.forces = new CANNON.Vec3(
      //   getRandomFloat(-this.forceThrust, this.forceThrust),
      //   getRandomFloat(-this.forceThrust, this.forceThrust),
      //   getRandomFloat(-this.forceThrust, this.forceThrust)
      // );

      // this.localImpact = new CANNON.Vec3(
      //   getRandomFloat(-1, 1),
      //   getRandomFloat(-1, 1),
      //   getRandomFloat(-1, 1)
      // );

      // console.log(this.asteroid);

      // this.asteroid.body.applyLocalForce(this.forces, new CANNON.Vec3(0, 0, 0));
    }
    if (this.asteroids.length < this.minAsteroids && this.spawnAsteroids) {
      console.log("SPAWNING");
      this.pushAsteroids();
    }
  }
  isWithinRadius(coordinate, center, radius) {
    return coordinate.distanceTo(center) < radius;
  }

  generateRandomCoordinatesOutsideRadius(center, radius, minDistance) {
    let randomCoordinate;
    do {
      randomCoordinate = new THREE.Vector3(
        getRandomFloat(center.x - radius, center.x + radius),
        getRandomFloat(center.y - radius, center.y + radius),
        getRandomFloat(center.z - radius, center.z + radius)
      );
    } while (this.isWithinRadius(randomCoordinate, center, minDistance));
    return randomCoordinate;
  }
  pushAsteroids() {
    this.minDistance = 2000;
    this.maxDistance = 2500;
    this.nbAsteroidsToSpawn = Math.floor(getRandomFloat(1, 5));

    for (let i = 0; i < this.nbAsteroidsToSpawn; i++) {
      const randomCoordinate = this.generateRandomCoordinatesOutsideRadius(
        this.spaceship.body.position,
        this.maxDistance,
        this.minDistance
      );
      this.asteroids.push(
        new Asteroid(getRandomFloat(10, 100), randomCoordinate, {
          x: getRandomFloat(-Math.PI * 2, Math.PI * 2),
          y: getRandomFloat(-Math.PI * 2, Math.PI * 2),
          z: getRandomFloat(-Math.PI * 2, Math.PI * 2),
        })
      );
    }
    // setTimeout(() => this.pushAsteroids(), 100);
  }

  move() {
    this.forces = new CANNON.Vec3(0, 0, 0);

    const rollAxis = new CANNON.Vec3(0, 0, 1);

    if (this.game.controls.keys.Z) {
      this.forces.y = 1 * this.rotation;
    }

    if (this.game.controls.keys.S) {
      this.forces.y = -1 * this.rotation;
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

import * as THREE from "three";

import Game from "./Game.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Spaceship from "./World/Spaceship.js";

export default class Camera {
  constructor() {
    this.game = new Game();
    this.sizes = this.game.sizes;
    this.scene = this.game.scene;
    this.canvas = this.game.canvas;
    this.spaceship = this.game.world.spaceship;

    //option
    this.cameraDistance = 13;
    this.cameraHeight = 4;

    this.setInstance();
    this.setControls();

    this.debug = this.game.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("camera");

      this.debugFolder
        .add(this, "cameraDistance")
        .min(5)
        .max(30)
        .step(0.1)
        .name("Distance");

      this.debugFolder
        .add(this, "cameraHeight")
        .min(0)
        .max(30)
        .step(0.1)
        .name("Hauteur");
    }
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      90,
      this.sizes.width / this.sizes.height,
      0.1,
      2000
    );
    this.scene.add(this.instance);
    this.instance.position.copy(this.spaceship.position);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
  update() {
    this.instance.position.copy(this.spaceship.position);
    this.instance.position.x -= this.cameraDistance;
    this.instance.position.y += this.cameraHeight;
    this.instance.lookAt(this.spaceship.position);

    this.controls.update();
  }
}

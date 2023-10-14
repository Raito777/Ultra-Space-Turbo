import * as THREE from "three";

import Game from "./Game.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor() {
    this.game = new Game();
    this.sizes = this.game.sizes;
    this.scene = this.game.scene;
    this.canvas = this.game.canvas;

    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      90,
      this.sizes.width / this.sizes.height,
      0.1,
      2000
    );
    this.instance.position.set(0, 2, 10);
    this.scene.add(this.instance);
  }

  setControls() {
    // this.controls = new OrbitControls(this.instance, this.canvas);
    // this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
  update() {
    // this.controls.update();
  }
}

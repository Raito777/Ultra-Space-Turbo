import * as THREE from "three";

import Game from "./Game.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
      4000
    );
    this.scene.add(this.instance);
    this.instance.position.copy(this.spaceship.position);
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
    // Copiez la position du vaisseau sur la caméra
    this.instance.position.copy(this.spaceship.position);

    // Ajustez la position de la caméra derrière le vaisseau
    const offsetVector = new THREE.Vector3(0, 0, -this.cameraDistance);
    offsetVector.applyEuler(this.spaceship.model.rotation);

    // Ajustez également la hauteur de la caméra
    offsetVector.y += this.cameraHeight;

    // Appliquez la position relative au vaisseau
    this.instance.position.add(offsetVector);

    // Copiez la rotation du vaisseau dans un quaternion
    const spaceshipQuaternion = new THREE.Quaternion();
    spaceshipQuaternion.setFromEuler(this.spaceship.model.rotation);

    // Effectuez une rotation de 180 degrés (π radians) autour de l'axe Y (pour éviter l'inversion)
    const cameraQuaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      Math.PI
    );
    spaceshipQuaternion.multiply(cameraQuaternion);

    // Appliquez le quaternion sur la caméra
    this.instance.setRotationFromQuaternion(spaceshipQuaternion);
  }
}

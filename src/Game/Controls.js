import * as THREE from "three";

import Game from "./Game.js";
import EventEmitter from "./Utils/EventEmitter.js";

export default class Controls extends EventEmitter {
  constructor() {
    super();

    this.keys = {
      Z: false,
      Q: false,
      S: false,
      D: false,
      Space: false,
    };

    document.addEventListener("keydown", (e) => {
      // Vérifier quelle touche a été enfoncée (par exemple, W, A, S, D)
      if (e && e.keyCode) {
        const keyCode = e.keyCode;
        console.log(keyCode);
        if (keyCode === 90) {
          // Z key
          this.keys.Z = true;
          this.trigger("moveUp");
        } else if (keyCode === 81) {
          // A key
          this.keys.Q = true;
          this.trigger("moveLeft");
        } else if (keyCode === 83) {
          // S key
          this.keys.S = true;
          this.trigger("moveDown");
        } else if (keyCode === 68) {
          // D key
          this.keys.D = true;
          this.trigger("moveRight");
        } else if (keyCode === 32) {
          this.keys.Space = true;
          this.trigger("space");
        }
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e && e.keyCode) {
        const keyCode = e.keyCode;
        if (keyCode === 90) {
          // Z key
          this.keys.Z = false;
          this.off("moveUp");
        } else if (keyCode === 81) {
          // A key
          this.keys.Q = false;
        } else if (keyCode === 83) {
          // S key
          this.keys.S = false;
        } else if (keyCode === 68) {
          // D key
          this.keys.D = false;
        } else if (keyCode === 32) {
          this.keys.Space = false;
          this.trigger("space");
        }
      }
    });
  }

  updateControls() {}
}

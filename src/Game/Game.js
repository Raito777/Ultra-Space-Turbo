import * as THREE from "three";
import * as CANNON from "cannon-es";

import Debug from "./Utils/Debug.js";

import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Resources from "./Utils/Resources.js";
import sources from "./sources.js";
import Controls from "./Controls.js";
import CannonDebugger from "cannon-es-debugger";

let instance = null;

export default class Game {
  constructor(canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    //Global access
    window.game = this;

    //Options
    this.canvas = canvas;

    //Setup
    this.debug = new Debug();

    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.renderer = new Renderer();
    this.world = new World();
    console.log(this.world.spaceship);
    this.camera = new Camera();
    this.renderer = new Renderer();

    this.controls = new Controls();

    /**
     * Physics
     */
    this.physicWorld = new CANNON.World();

    this.physicWorld.broadphase = new CANNON.SAPBroadphase(this.physicWorld);
    this.physicWorld.allowSleep = true;

    this.defaultMaterial = new CANNON.Material("default");
    const defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.001,
        restitution: 0.7,
      }
    );

    this.physicWorld.addContactMaterial(defaultContactMaterial);

    this.cannonDebugger = new CannonDebugger(this.scene, this.physicWorld, {});

    //Events

    //resize event
    this.sizes.on("resize", () => {
      this.resize;
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    if (this.world.ready) {
      this.renderer.update();
      this.world.update();
      this.camera.update();

      this.cannonDebugger.update();
    }
  }
}

import { Object3D, Scene, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { createAssets } from './assets';
import { Loop, createRenderer, createScene, createCamera, Resizer, createLights, createComposer, Pick, Control } from './system';
import { TickableCamera } from './system/types';

export class World {
  private static instance: World;
  public static createInstance = (container: HTMLElement) => {
    if (!World.instance) {
      World.instance = new World(container);
    }
    return World.instance;
  }

  private scene: Scene;
  private _camera: TickableCamera;
  private renderer: WebGLRenderer;
  private _controls: Control;
  private composer: EffectComposer;
  private loop: Loop;
  private resizer: Resizer;
  // private pick: Pick;
  private constructor(container: HTMLElement) {
    this.renderer = createRenderer(container);
    const canvas = this.renderer.domElement;
    this.scene = createScene();
    this._camera = createCamera(canvas);
    this.composer = createComposer(this.scene, this._camera, this.renderer);
    this.loop = new Loop(this.renderer, this.scene, this.composer);
    this._controls = new Control(this._camera, canvas);

    // this.pick = new Pick(canvas, this._camera.instance, this.scene,this._controls);
    this.resizer = new Resizer(this.renderer, this._camera, container);
    const assets = createAssets();
    // this.transformControl.attach(assets[1]);

    const lights = createLights();
    this.scene.add(...assets, ...lights,this._camera);
    this.renderer.render(this.scene, this._camera);
  }
  public start = () => {
    this.loop.start();
  }
  public stop = () => {
    this.loop.stop();
  }
  public dispose = () => {
    Object.values(this).forEach(component => {
      if (component.hasOwnProperty('dispose')) {
        component.dispose();
      }
      if (component instanceof Object3D && component.type === 'Scene') {
        component.traverse(com => com.dispatchEvent({ type: 'dispose' }));
      }
    })
  }
  public get camera() {
    return this._camera;
  }
  public get controls() {
    return this._controls;
  }
}
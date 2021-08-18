import { Object3D, Scene, WebGLRenderer } from 'three';
import { Data, DataBase, MyGroup } from '../shared/types';
import { Assets } from './assets';
import { Loop, createRenderer, createScene, createCamera, Resizer, createLights, Control } from './system';
import { TickableCamera } from './system/types';

export class World {
  private static instance: World;
  public static getInstance = (container: HTMLElement) => {
    if (!World.instance) {
      World.instance = new World(container);
    }
    return World.instance;
  }

  private scene: Scene;
  private _camera: TickableCamera;
  private renderer: WebGLRenderer;
  private _controls: Control;
  private loop: Loop;
  private resizer: Resizer;
  private gap = 20;
  private assets: Assets;

  private constructor(container: HTMLElement) {
    this.renderer = createRenderer(container);
    const canvas = this.renderer.domElement;
    this.scene = createScene();
    this._camera = createCamera(canvas);
    this.resizer = new Resizer(this.renderer, this._camera, container);
    this.assets = new Assets(this.gap);
    const { components, pickArea, selectEffect } = this.assets.create();
    const lights = createLights();
    this.scene.add(...components, ...lights, this._camera);
    this.renderer.render(this.scene, this._camera);
    this._controls = new Control(this._camera, canvas, this.scene, pickArea,selectEffect);
    this._controls.gap = this.gap;
    this.assets.controls = this._controls;
    this.loop = new Loop(this.renderer, this.scene, this._camera);
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
  public create = (data: number | { [prop: string]: Data }) => {
    if (typeof data === 'number') {
      const obj = this.assets.createGroupByID(data);
      this.scene.add(obj);
      this.assets.showGrid(true);
    } else {
      const objs = this.assets.createGroups(data);
      this.scene.add(...objs);
    }
  }
  public get camera() {
    return this._camera;
  }
  public get controls() {
    return this._controls;
  }
  public set database(data: { [prop: string]: DataBase }) {
    this.assets.database = data;
  }
  public set cb(fn: (id: number) => void) {
    this._controls.cb = (obj: Object3D | MyGroup | null) => {
      if (!obj) {
        fn(-1);
      } else if ('localID' in obj) {
        const id = this.assets.map.get(obj.localID);
        fn(id);
      }
    };
  }
}
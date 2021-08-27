import { Cache, Object3D, Scene, WebGLRenderer } from 'three';
import { Character, State } from '../shared';
import { BlockGenerator } from './block';
import { BulletGenerator } from './bullet';
import { Collision } from './collision';
import { ParticleGenerator } from './particle';
import { Player } from './player';
import { SmokeGenerator } from './smoke';
import { Loop, MyRenderer, MyScene, MyPerspectiveCamera, Resizer, Lights } from './system';

export class World {
  private scene: Scene;
  private camera: MyPerspectiveCamera;
  private renderer: WebGLRenderer;
  private loop: Loop;
  private resizer: Resizer;
  private lights: Lights;
  private blockGenerator?: BlockGenerator;
  private player?: Player;

  constructor(container: HTMLElement, private getPoint: (value: number) => void, private getHurt: () => void) {
    Cache.enabled = true;
    this.renderer = new MyRenderer(container);
    const canvas = this.renderer.domElement;
    const { clientWidth, clientHeight } = canvas;
    this.scene = new MyScene();
    this.camera = new MyPerspectiveCamera(20, clientWidth / clientHeight, 0.1, 1000);
    this.resizer = new Resizer(this.renderer, this.camera, container);
    this.lights = new Lights();
    const { assets, playerGroup, enemyGroup } = this.createAssets(canvas);
    this.scene.add(...assets, ...this.lights.instance, this.camera);
    const collision = new Collision(playerGroup, enemyGroup);
    this.loop = new Loop(this.renderer, this.scene, this.camera, [collision]);
    this.loop.start();
  }
  private createAssets = (canvas: HTMLCanvasElement) => {
    const particleGenerator = new ParticleGenerator();
    const smokeGenerator = new SmokeGenerator();
    this.blockGenerator = new BlockGenerator(particleGenerator, this.getPoint);
    const bulletGenerator = new BulletGenerator();
    this.player = new Player(canvas, this.camera, bulletGenerator, smokeGenerator, this.getHurt);

    return {
      assets: [this.blockGenerator, bulletGenerator, this.player, particleGenerator, smokeGenerator],
      playerGroup: [this.player, bulletGenerator.children] as Character[],
      enemyGroup: this.blockGenerator.children as Character[],
    }
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
  public setState = (state: State) => {
    switch (state) {
      case State.Playing: {
        this.player?.enable();
        this.blockGenerator?.reset();
        break;
      }
      case State.End: {
        this.player?.disable();
        break;
      }
    }
  }
}
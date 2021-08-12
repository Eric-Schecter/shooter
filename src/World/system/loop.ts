import { Clock, Scene, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { TickAble } from "./types";

export class Loop {
  private clock = new Clock();
  constructor(private renderer: WebGLRenderer, private scene: Scene, private composer?: EffectComposer) { }
  private tick = (delta: number) => {
    this.scene.traverse((obj) => {
      const tickableObj = obj as TickAble;
      tickableObj.needTick && tickableObj.tick && tickableObj.tick(delta);
    })
  }
  public start = () => {
    this.renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta();
      this.tick(delta);
      this.composer?.render();
    });
  }
  public stop = () => {
    this.renderer.setAnimationLoop(null);
  }
}

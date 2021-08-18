import { Camera, Clock, Scene, WebGLRenderer } from "three";
import { TickAble } from "./types";

export class Loop {
  private clock = new Clock();
  constructor(private renderer: WebGLRenderer, private scene: Scene, private camera: Camera) { }
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
      this.renderer.render(this.scene, this.camera);
    });
  }
  public stop = () => {
    this.renderer.setAnimationLoop(null);
  }
}

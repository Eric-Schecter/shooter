import { Camera, Clock, Scene, WebGLRenderer } from "three";
import { Tickable } from "../../shared/types";

export class Loop {
  private clock = new Clock();
  constructor(private renderer: WebGLRenderer, private scene: Scene, private camera: Camera, private tickables: (Tickable | Tickable[])[]) { }
  private tick = (delta: number) => {
    this.tickables.forEach(tickable => {
      if (Array.isArray(tickable)) {
        tickable.forEach(obj => obj.tick && obj.tick(delta))
      } else {
        tickable.tick && tickable.tick(delta)
      }
    });
    this.scene.traverse(obj => {
      const tickableObj = obj as Tickable;
      tickableObj.tick && tickableObj.tick(delta);
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

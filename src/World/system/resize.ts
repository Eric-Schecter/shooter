import { Renderer, PerspectiveCamera, Camera } from "three";
import { debounce } from "../utils";

export class Resizer {
  constructor(private renderer: Renderer, private camera: Camera, private container: HTMLElement) {
    this.initEvents();
  }
  public resize = () => {
    const { clientWidth: width, clientHeight: height } = this.container;
    this.renderer.setSize(width, height);
    if (this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
  private debouncedResize = debounce(this.resize, 100);
  private initEvents = () => {
    window.addEventListener('resize', this.debouncedResize);
  }
  public dispose = () => {
    window.removeEventListener('resize', this.debouncedResize);
  }
}

import { Camera, Object3D, Raycaster, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class Pick {
  private raycaster = new Raycaster();
  private target: Object3D | null = null;
  constructor(private canvas: HTMLCanvasElement, private camera: Camera, private scene: Scene,private controls:OrbitControls) {
    this.initEvents();
  }
  private update = (clientX: number, clientY: number) => {
    const x = clientX / this.canvas.clientWidth * 2 - 1;
    const y = -(clientY / this.canvas.clientHeight) * 2 + 1;
    return { x, y };
  }
  private down = ({ clientX, clientY }: MouseEvent) => {
    const { x, y } = this.update(clientX, clientY);
    this.raycaster.setFromCamera({ x, y }, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (intersects.length) {
      const [{ point, object }] = intersects;
      this.target = object;
      this.canvas.addEventListener('pointermove', this.move);
      this.canvas.addEventListener('pointerup', this.up);
    }
  }
  private move = ({ clientX, clientY }: MouseEvent) => {
    if (!this.target) { return }
    const { x, y } = this.update(clientX, clientY);
    // console.log(x,y)
  }
  private up = () => {
    this.target = null;

    this.canvas.removeEventListener('pointermove', this.move);
    this.canvas.removeEventListener('pointerup', this.up);
  }
  private initEvents = () => {
    this.canvas.addEventListener('pointerdown', this.down);

  }
  public dispose = () => {
    this.canvas.removeEventListener('pointerdown', this.down);

  }
}
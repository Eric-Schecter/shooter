import { Camera, PerspectiveCamera, Vector3 } from "three";
import { World } from "../World";
import { Command } from "./command";

export class ChangeViewCommand extends Command {
  private speed = 10;
  private initState = {
    pos: new Vector3(0, 250, 500),
    up: new Vector3(0, 1, 0),
  }
  private is3D = true;
  constructor(private executor?: World, private isReset = false) {
    super();
  }
  private handleTarget = (size: number, camera: Camera) => {
    if (this.isReset) {
      const { pos, up } = this.initState;
      return [pos, up];
    }
    if (this.is3D) {
      const y = size * 2;
      if (camera instanceof PerspectiveCamera && y > camera.far) {
        camera.far = y + 10;
        camera.updateProjectionMatrix();
      }
      return [new Vector3(0, y, 0), new Vector3(0, 0, -1)];
    }
    return [new Vector3(250, 250, 250), new Vector3(0, 1, 0)]
  }
  private update = () => {
    if (!this.executor) { return }
    const { camera,controls } = this.executor;
    const { up, position } = camera;
    const size = 200;
    const [target, targetUp] = this.handleTarget(size, camera);
    const direction = new Vector3().copy(target).sub(position);
    const directionUp = new Vector3().copy(targetUp).sub(up);
    position.add(direction.divideScalar(this.speed));
    up.add(directionUp.divideScalar(this.speed));
    camera.lookAt(0, 0, 0);
    if (target.distanceTo(position) <= 1 && targetUp.distanceTo(up) < 0.001) {
      this.is3D = this.isReset || !this.is3D;
      if(this.isReset){
        controls.reset();
      }
      camera.needTick = false;
    }
  }
  public execute = () => {
    if (!this.executor) { return }
    const { camera } = this.executor;
    camera.tick = this.update;
    camera.needTick = true;
  }
}

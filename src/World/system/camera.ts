import { PerspectiveCamera } from "three";

export class MyPerspectiveCamera extends PerspectiveCamera {
  constructor(fov: number, ratio: number, near: number, far: number) {
    super(fov, ratio, near, far);
    this.position.set(0, 0, 200);
    this.up.set(0, 1, 0);
    this.lookAt(0, 0, 0);
  }
}
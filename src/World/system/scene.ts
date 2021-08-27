import { Color, Scene } from "three";

export class MyScene extends Scene {
  constructor() {
    super();
    this.background = new Color(0xc5f5f5);
  }
}
import { Mesh, PlaneBufferGeometry, ShaderMaterial } from "three";
import * as vertexShader from './vertex.vert';
import * as fragmentShader from './fragment.frag';

export class SelectEffect {
  private static instance: SelectEffect;
  public static getInstance = () => {
    if (!SelectEffect.instance) {
      SelectEffect.instance = new SelectEffect();
    }
    return SelectEffect.instance;
  }
  private constructor() { }
  private createMaterial = (size: number) => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        size: { value: size / 2 },
      },
      transparent: true,
    });
  }
  public create = (size: number) => {
    const geometry = new PlaneBufferGeometry(size, size, 1);
    const material = this.createMaterial(size);
    const mesh = new Mesh(geometry, material);
    mesh.position.setY(0.5);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    mesh.name = 'effect';
    return mesh;
  }
}
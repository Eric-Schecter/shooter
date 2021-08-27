import { AdditiveBlending, Mesh, ShaderMaterial, SphereBufferGeometry, TextureLoader, Vector3 } from "three";
import { medias, Tickable } from "../../../shared";
import * as vertexShader from './vertexShader.vert';
import * as fragmentShader from './fragmentShader.frag';

export class Shield extends Mesh implements Tickable {
  private static createGeometry = ({ x }: Vector3) => {
    return new SphereBufferGeometry(x, 32, 32);
  }
  private static createMaterial = () => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uLife: { value: 0 },
        uDiffuse: { value: new TextureLoader().load(medias.images.blaster) },
      },
      blending: AdditiveBlending,
    });
  }
  constructor(size: Vector3) {
    super(Shield.createGeometry(size), Shield.createMaterial());
  }
  public reset = (time: number) => {
    (this.material as ShaderMaterial).uniforms.uLife.value = time / 1000;
  }
  public tick = (delta: number) => {
    (this.material as ShaderMaterial).uniforms.uLife.value -= delta;
  }
}
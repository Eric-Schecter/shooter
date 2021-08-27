import { BufferAttribute, BufferGeometry, NormalBlending, Points, ShaderMaterial, TextureLoader, Vector3 } from "three";
import { Character, medias, random, Tickable } from "../../shared";
import * as vertexShader from './vertexShader.vert';
import * as fragmentShader from './fragmentShader.frag';
import { Generator } from "../generator";

export class Smoke extends Points implements Tickable {
  private hp = 10;
  private static createGeometry = () => {
    return new BufferGeometry();
  }
  private static createMaterial = () => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uDiffuse: { value: new TextureLoader().load(medias.images.fire) },
        uOpacity: { value: 10 },
      },
      blending: NormalBlending,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });
  }
  constructor(pos: Vector3) {
    super(Smoke.createGeometry(), Smoke.createMaterial());
    // this.position.copy(pos);
    this.geometry.setAttribute('position', new BufferAttribute(new Float32Array(pos.toArray()), 3));
  }
  public tick = (delta: number) => {
    this.hp -= 5 * delta;
    (this.material as ShaderMaterial).uniforms.uOpacity.value = this.hp;
  }
  public get isDead() {
    return this.hp <= 0;
  }
}

export class SmokeGenerator extends Generator implements Tickable {
  public emit = (pos: Vector3) => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          const offset = new Vector3(random(-3 - i * 2, 3 - i * 2), random(-4, 4), 10).add(pos);
          this.add(new Smoke(offset));
        }
      }, i * 20);
    }
  }
  public tick = () => {
    (this.children as Array<Character>).forEach(child => {
      if (child.isDead) {
        this.remove(child);
      }
    })
  }
}

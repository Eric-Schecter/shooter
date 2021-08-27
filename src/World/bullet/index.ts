import { AdditiveBlending, BoxBufferGeometry, Mesh, ShaderMaterial, TextureLoader, Vector3 } from "three";
import { Character, Hitable, medias, Tickable } from "../../shared";
import * as vertexShader from './vertexShader.vert';
import * as fragmentShader from './fragmentShader.frag';
import { Generator } from "../generator";

export class Bullet extends Mesh implements Tickable, Hitable {
  private speed = 150;
  private hp = 1;
  private _power = 1;
  private static createGeometry = () => {
    return new BoxBufferGeometry(1, 1, 1);
  }
  private static createMaterial = () => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new Vector3(.3, .5, 1.) },
        uDiffuse: { value: new TextureLoader().load(medias.images.blaster) },
      },
      blending: AdditiveBlending,
    });
  }
  constructor(pos:Vector3) {
    super(Bullet.createGeometry(), Bullet.createMaterial());
    this.position.copy(pos);
  }
  public tick = (delta: number) => {
    this.position.x += delta * this.speed;
  }
  public hit = (character: Hitable) => {
    this.hp -= character.power;
  }
  public get isDead() {
    return this.hp <= 0;
  }
  public get power() {
    return this._power;
  }
}

export class BulletGenerator extends Generator implements Tickable {
  public fire = (pos: Vector3) => {
    this.add(new Bullet(pos));
  }
  public tick = () => {
    (this.children as Array<Character>).forEach(child => {
      if (child.position.x > 80 || child.isDead) {
        this.remove(child);
      }
    })
  }
}

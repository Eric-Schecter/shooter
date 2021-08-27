import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { Hitable, random, Tickable } from "../shared";
import { Generator } from "./generator";
import { ParticleGenerator } from "./particle";

class Block extends Mesh implements Tickable, Hitable {
  private hp: number;
  private _power = 1;
  constructor(pos: Vector3, private size: number, private effect: ParticleGenerator) {
    super();
    this.geometry = new BoxBufferGeometry(1, 1, 1);
    this.material = new MeshStandardMaterial({
      depthTest: false,
    });
    this.scale.set(size, size, size);
    this.hp = size;
    this.position.copy(pos);
    this.renderOrder = 999;
  }
  public tick = (delta: number) => {
    this.position.x -= 80 * delta / this.size;
    this.rotation.x += 0.01;
    this.rotation.y += 0.05;
  }
  public hit = (character: Hitable) => {
    this.hp -= character.power;
    this.effect.emit(this.position);
    this.scale.set(this.hp, this.hp, this.hp);
  }
  public get power() {
    return this._power;
  }
  public get isDead() {
    return this.hp <= 1;
  }
  public get point() {
    return Math.round(this.size);
  }
}

export class BlockGenerator extends Generator implements Tickable {
  private limit = 10;
  private active = false;
  constructor(private particleGenerator: ParticleGenerator, private getPoint: (value: number) => void) {
    super();
  }
  private generate = () => {
    for (let i = 0; i < this.limit - this.children.length; i++) {
      const pos = new Vector3(100, random(-30, 30), 0);
      const block = new Block(pos, random(3, 5), this.particleGenerator);
      this.add(block);
    }
  }
  public tick = () => {
    this.active && this.generate();
    (this.children as Block[]).forEach(child => {
      if (child.isDead) {
        this.getPoint(child.point);
      }
      if (child.position.x < -80 || child.isDead) {
        this.remove(child);
      }
    })
  }
  public reset = () => {
    this.active = true;
    this.remove(...this.children);
  }
}
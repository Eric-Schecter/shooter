import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { random, Tickable } from "../shared";
import { Generator } from "./generator";

class Particle extends Mesh implements Tickable {
  private life = 1;
  constructor(pos: Vector3, private v: Vector3) {
    super(
      new BoxBufferGeometry(1, 1, 1),
      new MeshStandardMaterial({
        transparent: true,
      }));
    this.position.copy(pos);
  }
  public tick = (delta: number) => {
    this.position.add(this.v.clone().multiplyScalar(delta * 50));
    (this.material as MeshStandardMaterial).opacity = this.life;
    this.life -= 0.1 * delta;
  }
  public get isDead() {
    return this.life <= 0;
  }
}

export class ParticleGenerator extends Generator implements Tickable {
  private count = 5;
  public emit = (pos: Vector3) => {
    for (let i = 0; i < random(1, this.count); i++) {
      const v = new Vector3(random(0.5, 1), random(-1, 1), random(-1, 1));
      this.add(new Particle(pos, v));
    }
  }
  public tick = () => {
    (this.children as Particle[]).forEach(observer => {
      if (observer.position.x > 80 || observer.isDead) {
        this.remove(observer);
      }
    })
  }
}
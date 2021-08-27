import { Box3, Object3D } from "three";
import { Character, Tickable } from "../shared";
import { Bullet } from "./bullet";
import { Player } from "./player";

export class Collision implements Tickable {
  private box1 = new Box3();
  private box2 = new Box3();
  constructor(private group1: Array<Character | Character[]>, private group2: Array<Character | Character[]>) { }
  public checkEach = (obj1: Object3D, obj2: Object3D) => {
    this.box1.setFromObject(obj1);
    this.box2.setFromObject(obj2);
    return this.box1.intersectsBox(this.box2);
  }
  public tick = () => {
    const group1 = this.group1.flat();
    const group2 = this.group2.flat();
    group1.forEach(c1 => {
      group2.forEach(c2 => {
        const o1 = c1 instanceof Player ? c1.children[0] || c1 : c1;
        const isIntersected = this.checkEach(o1, c2);
        if (isIntersected) {
          if (c1 instanceof Bullet) {
            c2.hit(c1);
          }
          c1.hit(c2);
        }
      })
    }) 
  }
}

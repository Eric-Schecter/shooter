import { Box3, Group, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Hitable, initHP, medias, Tickable } from "../../shared";
import { BulletGenerator } from "./../bullet";
import { Motion } from "./motion";
import { Shield } from "./shield";
import { audioHandler, MyPerspectiveCamera } from "./../system";
import { SmokeGenerator } from "../smoke";

export class Player extends Group implements Tickable, Hitable {
  private motion: Motion;
  private shield?: Shield;
  private hp = initHP;
  private _power = 0;
  private invincible = false;
  private hasExplosion = false;
  constructor(canvas: HTMLCanvasElement, camera: MyPerspectiveCamera, bulletGenerator: BulletGenerator,
    private smokeGenerator: SmokeGenerator, private getHurt: () => void) {
    super();
    new GLTFLoader().load(medias.models.Rocket_Ship_01, gltf => {
      const { scene } = gltf;
      scene.rotateZ(-Math.PI / 2);
      const target = new Vector3();
      new Box3().setFromObject(scene).getSize(target);
      this.shield = new Shield(target);
      this.motion.offset = target.x;
      this.add(scene, this.shield);
    })
    this.motion = new Motion(canvas, camera, this, bulletGenerator);
  }
  private explosion = () => {
    this.smokeGenerator.emit(this.position);
    audioHandler.play(medias.audios.explosion, 0.5);
    this.children.forEach(child => child.visible = false);
    this.hasExplosion = true;
  }
  public hit = (character: Hitable) => {
    if (this.invincible || this.hasExplosion) { return }
    this.hp -= character.power;
    const time = 1000;
    this.invincible = true;
    this.shield?.reset(time);
    audioHandler.play(medias.audios.player_hit);
    this.getHurt();
    setTimeout(() => {
      this.invincible = false;
    }, time);
  }
  public tick = () => {
    this.motion.tick();
    if (this.isDead && !this.hasExplosion) {
      this.explosion();
    }
  }
  public dispose = () => {
    this.motion.dispose();
  }
  public enable = () => {
    this.hasExplosion = false;
    this.children.forEach(child => child.visible = true);
    this.hp = initHP;
    this.motion.start();
  }
  public disable = () => {
    this.motion.stop();
  }
  public get power() {
    return this._power;
  }
  public get isDead() {
    return this.hp <= 0;
  }
}
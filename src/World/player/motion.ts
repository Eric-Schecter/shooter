import { Vector2, Vector3 } from "three";
import { medias } from "../../shared";
import { BulletGenerator } from "./../bullet";
import { Player } from "./../player";
import { audioHandler, MyPerspectiveCamera } from "./../system";

enum State {
  Normal,
  Fire,
}

export class Motion {
  private mouse: Vector2;
  private _offset = 0;
  private state = State.Normal;
  private isLocked = false;
  private fireSpeed = 120;
  constructor(private canvas: HTMLCanvasElement, private camera: MyPerspectiveCamera, private player: Player,
    private bulletGenerator: BulletGenerator) {
    this.addEvents();
    const { clientWidth, clientHeight } = canvas;
    this.mouse = new Vector2(clientWidth / 2, clientHeight / 2);
  }
  private normalize = (px: number, py: number) => {
    const x = px / this.canvas.clientWidth * 2 - 1;
    const y = -(py / this.canvas.clientHeight) * 2 + 1;
    return [x, y];
  }
  private screen2world = (mouse: Vector3) => {
    const { x, y } = mouse;
    const vec = new Vector3(x, y, 0.5);
    vec.unproject(this.camera);
    vec.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / vec.z;
    const pos = new Vector3();
    pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
    return pos;
  }
  private move = ({ offsetX: x, offsetY: y }: MouseEvent) => {
    this.mouse.set(x, y);
  }
  public tick = () => {
    const { x, y } = this.mouse;
    const [sx, sy] = this.normalize(x, y);
    const target = this.screen2world(new Vector3(sx, sy, 0));
    target.x -= this._offset;
    const s = target.sub(this.player.position);
    this.player.position.add(s.multiplyScalar(0.1));
    this.player.rotation.x += 0.1;
    if (this.state === State.Fire) {
      this.fire();
      this.player.rotation.x += 0.1;
    }
  }
  private fire = () => {
    if (!this.isLocked) {
      this.isLocked = true;
      const pos = new Vector3().copy(this.player.position.clone());
      pos.x += this._offset;
      this.bulletGenerator.fire(pos);
      audioHandler.play(medias.audios.player_shoot);
      setTimeout(() => {
        this.isLocked = false;
      }, this.fireSpeed);
    }
  }
  private fireMode = () => {
    this.state = State.Fire;
  }
  private normalMode = () => {
    this.state = State.Normal;
  }
  public addEvents = () => {
    this.dispose();
    this.canvas.addEventListener('pointermove', this.move);
    this.canvas.addEventListener('pointerup', this.normalMode);
  }
  public dispose = () => {
    this.canvas.removeEventListener('pointermove', this.move);
    this.canvas.removeEventListener('pointerdown', this.fireMode);
    this.canvas.removeEventListener('pointerup', this.normalMode);
  }
  public start = () =>{
    this.canvas.addEventListener('pointerdown', this.fireMode);
  }
  public stop = () =>{
    this.state = State.Normal;
    this.canvas.removeEventListener('pointerdown', this.fireMode);
  }
  public set offset(value: number) {
    this._offset = value;
  }
}
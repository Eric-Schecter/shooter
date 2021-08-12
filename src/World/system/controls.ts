import { Euler, MathUtils, Quaternion, Spherical, Vector3 } from "three";
import { TickableCamera } from "./types";

enum Mouse {
  Default = 0,
  Left = 1,
  Right = 2,
}

class RotateSphere {
  private _rotateSpeed = 0.005;
  private _pivot = new Spherical();
  private start = new Quaternion();
  private end = new Quaternion();
  private _current = new Quaternion();
  private limit = {
    phiMin: 0.001,
    phiMax: Math.PI / 2,
    thetaMin: -Math.PI / 2,
    thetaMax: Math.PI / 2,
  }
  public rotateHorizontal = (x: number, z: number) => {
    const { phiMin, phiMax, thetaMin, thetaMax } = this.limit;
    this.pivot.phi -= z * this._rotateSpeed;
    this.pivot.theta -= x * this._rotateSpeed;
    this.pivot.phi = MathUtils.clamp(this._pivot.phi, phiMin, phiMax);
    this.pivot.theta = MathUtils.clamp(this._pivot.theta, thetaMin, thetaMax);
  }
  public resetStart = (quaternion: Quaternion) => {
    this.start.copy(quaternion);
    this.limit.phiMin = Math.PI / 2 - this.pivot.phi;
  }
  public reset = (x: number, y: number, z: number) => {
    this.pivot.setFromCartesianCoords(x, y, z);
    this.start.setFromEuler(new Euler(0, 0, 0));
    this.end.setFromEuler(new Euler(-Math.PI / 2, 0, 0));
  }
  public rotateVertical = (value: number) => {
    const { phiMin, phiMax } = this.limit;
    this.pivot.phi += value;
    this.pivot.phi = MathUtils.clamp(this.pivot.phi, 0.001, phiMax - phiMin);
    const process = 1 - this.pivot.phi / (phiMax - phiMin);
    Quaternion.slerp(this.start, this.end, this.current, process);
    return process;
  }
  public get pivot() {
    return this._pivot;
  }
  public get rotateSpeed() {
    return this._rotateSpeed;
  }
  public get current() {
    return this._current;
  }
}

export class Control {
  private pos = new Vector3(0, 0, 0);
  private posInit = new Vector3();
  private target = new Vector3(0, 0, 0);
  private targetInit = new Vector3(0, 0, 0);
  private type: Mouse = Mouse.Default;

  private _isFixed = false;
  private rotateShpere: RotateSphere;
  constructor(private camera: TickableCamera, private canvas: HTMLCanvasElement) {
    this.initEvents();
    this.posInit.copy(camera.position);
    this.rotateShpere = new RotateSphere();
    this.reset();
  }
  private onContextMenu = (e: Event) => {
    e.preventDefault();
  }
  private leftMouseMove = (x: number, z: number) => {
    this.rotateShpere.rotateHorizontal(x, z);
    this.camera.position.setFromSpherical(this.rotateShpere.pivot);
    this.camera.position.add(this.target);
    this.camera.lookAt(this.target);
  }
  private rightMouseMove = (x: number, z: number) => {
    const angle = this.rotateShpere.pivot.theta;
    const ox = (x * Math.cos(angle) + z * Math.sin(angle)) / 2;
    const oz = (z * Math.cos(angle) - x * Math.sin(angle)) / 2;
    this.camera.position.x -= ox;
    this.camera.position.z -= oz;
    this.target.x -= ox;
    this.target.z -= oz;
  }
  private onPointerMove = ({ clientX, clientY }: MouseEvent) => {
    const x = clientX - this.pos.x;
    const z = clientY - this.pos.z;
    if (this.type === Mouse.Left && !this._isFixed) {
      this.leftMouseMove(x, z);
    } else if (this.type === Mouse.Right) {
      this.rightMouseMove(x, z)
    }
    this.pos.x = clientX;
    this.pos.z = clientY;
  }
  private onPointerUp = () => {
    this.rotateShpere.resetStart(this.camera.quaternion);
    this.type = Mouse.Default;
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }
  private onPointerDown = ({ clientX, clientY, buttons }: MouseEvent) => {
    this.pos.x = clientX;
    this.pos.z = clientY;
    this.type = buttons;
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }
  private onMouseWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (this.camera.needTick) { return }
    const { deltaY } = e;
    const direction = Math.sign(deltaY);
    let preProcess = -1;
    this.camera.needTick = true;
    this.camera.tick = (delta:number) =>{
      const value = direction * this.rotateShpere.rotateSpeed * 400 * delta;
      const process = this.rotateShpere.rotateVertical(value);
      this.camera.quaternion.copy(this.rotateShpere.current);
      this.camera.position.setFromSpherical(this.rotateShpere.pivot);
      this.camera.position.add(this.target);
      if(process===preProcess){
        this.camera.needTick = false;
      }else{
        preProcess = process;
      }
    }
  }
  private initEvents = () => {
    this.canvas.addEventListener('contextmenu', this.onContextMenu);
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('wheel', this.onMouseWheel, { passive: false });
  }
  public dispose = () => {
    this.canvas.removeEventListener('contextmenu', this.onContextMenu);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('wheel', this.onMouseWheel);
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerMove);
  }
  public reset = () => {
    this.pos.copy(this.posInit);
    this.target.copy(this.targetInit);
    const { x, y, z } = this.posInit;
    this.rotateShpere.reset(x, y, z);
  }
  public get isFixed() {
    return this._isFixed;
  }
  public set isFixed(type: boolean) {
    this._isFixed = type;
  }
}
import { Euler, MathUtils, Quaternion, Spherical } from "three";

export class RotateSphere {
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
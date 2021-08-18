import { Vector3 } from "three";

export class Movement {
  private _cameraStartPos = new Vector3(0, 0, 0);
  private _dragStartPos = new Vector3(0, 0, 0);
  private _worldInitPos = new Vector3();
  private _worldStartPos = new Vector3();
  constructor(initPos: Vector3) {
    this._worldInitPos.copy(initPos);
  }
  public dragOffsetScreen = (x: number, z: number) => {
    return [x - this._dragStartPos.x, z - this._dragStartPos.z];
  }
  // public updateCameraStartPos = (x: number, z: number) => {
  //   this._cameraStartPos.x = x;
  //   this._cameraStartPos.z = z;
  // }
  public dragOffsetWorld = (point: Vector3) => {
    return point.sub(this._worldStartPos);
  }
  public init = () => {
    this._cameraStartPos.copy(this._worldInitPos);
  }
  public updateDragStartPos = (x: number, z: number) => {
    this.dragStartPos.x = x;
    this.dragStartPos.z = z;
  }
  public get dragStartPos() {
    return this._dragStartPos;
  }
  public get cameraStartPos() {
    return this._cameraStartPos;
  }
  public set setWorldStartPoint(point: Vector3) {
    this._worldStartPos.copy(point);
  }
}
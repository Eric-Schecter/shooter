import { Box3, MathUtils, Mesh, Object3D, Scene, Vector3 } from "three";
import { Intersect } from "./intersect";
import { TickableCamera } from "../types";
import { RotateSphere } from "./rotateSphere";
import { Mouse } from "./types";
import { Movement } from "./movement";

export class Control {
  private target = new Vector3(0, 0, 0);
  private targetInit = new Vector3(0, 0, 0);
  private type: Mouse = Mouse.Default;
  private initPos = new Vector3();
  private isMoved = false;
  private _isFixed = false;
  private rotateSphere = new RotateSphere();
  private intersect: Intersect;
  private movement: Movement;
  private _gap = 20;

  constructor(private camera: TickableCamera, private canvas: HTMLCanvasElement,
    private scene: Scene, pickArea: Mesh, selectEffect: Mesh) {
    this.initEvents();
    this.movement = new Movement(camera.position);
    this.intersect = new Intersect(canvas, camera, scene, pickArea, selectEffect);
    this.reset();
  }
  private onContextMenu = (e: Event) => {
    e.preventDefault();
  }
  private leftMouseMove = (x: number, z: number) => {
    this.rotateSphere.rotateHorizontal(x, z);
    this.camera.position.setFromSpherical(this.rotateSphere.pivot);
    this.camera.position.add(this.target);
    this.camera.lookAt(this.target);
  }
  private rightMouseMove = (x: number, z: number) => {
    const angle = this.rotateSphere.pivot.theta;
    const ox = (x * Math.cos(angle) + z * Math.sin(angle)) / 2;
    const oz = (z * Math.cos(angle) - x * Math.sin(angle)) / 2;
    this.camera.position.x -= ox;
    this.camera.position.z -= oz;
    this.target.x -= ox;
    this.target.z -= oz;
  }
  private checkIntersect = (object: Object3D) => {
    const box1 = new Box3().setFromObject(object);
    const box2 = new Box3();
    let isIntersected = false;
    this.scene.traverseVisible(obj => {
      if (obj !== object) {
        box2.setFromObject(obj);
        if (box1.intersectsBox(box2) && obj.name === 'wrapper') {
          isIntersected = true;
        }
      }
    })
    if (isIntersected) {
      this.intersect.highlight();
    } else {
      this.intersect.restoreMaterial();
    }
  }
  private moveTarget = (object: Object3D, x: number, z: number) => {
    this.intersect.checkIntersectPoint(x, z);
    const { point } = this.intersect;
    if (!point) { return; }
    const { x: px, z: pz } = point;

    const column = this._gap <= 0 ? px : Math.floor((px + this._gap) / (this._gap * 2));
    const row = this._gap <= 0 ? pz : Math.floor((pz + this._gap) / (this._gap * 2));

    object.position.setX(column * this._gap * 2);
    object.position.setZ(row * this._gap * 2);

    this.checkIntersect(object);
  }
  private onPointerMove = ({ offsetX, offsetY }: MouseEvent) => {
    const [x, z] = this.movement.dragOffsetScreen(offsetX, offsetY);
    this.camera.needTick = false;
    if (this.type === Mouse.Left && !this._isFixed) {
      if (!this.intersect.object) {
        this.leftMouseMove(x, z);
      } else {
        if (!this.isMoved && this.intersect.point) {
          const vector = this.movement.dragOffsetWorld(this.intersect.point);
          this.isMoved = vector.length() > (this._gap * 2) ** 2;
        }
        if (this.isMoved) {
          this.moveTarget(this.intersect.object, offsetX, offsetY);
        }
      }
    } else if (this.type === Mouse.Right) {
      this.rightMouseMove(x, z)
    }
    this.movement.updateDragStartPos(offsetX, offsetY);
  }
  private onDoubleClick = () => {
    if (!this.intersect.object) { return }
    const lookatTarget = new Vector3().copy(this.target);
    this.target.copy(this.intersect.object.position);
    const distance = 300;
    const tempTarget = new Vector3().copy(this.target).add(new Vector3(distance, distance / 2, distance));
    const speed = 5;
    const lookDirection = new Vector3();
    this.camera.needTick = true;
    this.camera.tick = (delta: number) => {
      if (this.camera.position.distanceTo(tempTarget) < 1) {
        this.camera.needTick = false;
      }
      this.camera.position.lerp(tempTarget, delta * speed);
      lookatTarget.lerp(this.target, delta * speed);
      this.camera.lookAt(lookatTarget);
      this.rotateSphere.pivot.radius = this.camera.position.distanceTo(lookatTarget);
      this.rotateSphere.pivot.setFromVector3(lookDirection.copy(this.camera.position).sub(lookatTarget))
      this.rotateSphere.resetStart(this.camera.quaternion);
    }
  }
  private onPointerUp = () => {
    this.rotateSphere.resetStart(this.camera.quaternion);
    this.type = Mouse.Default;
    this.isMoved = false;
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }
  private onKeydown = ({ key }: KeyboardEvent) => {
    const { object } = this.intersect;
    if (key === 'Backspace' && object) {
      this.scene.remove(object);
    }
  }
  private onPointerDown = ({ offsetX, offsetY, buttons }: MouseEvent) => {
    // this.movement.updateCameraStartPos(offsetX, offsetY);
    this.movement.updateDragStartPos(offsetX, offsetY);
    this.type = buttons;
    this.intersect.checkIntersectObject(offsetX, offsetY);
    this.intersect.checkIntersectPoint(offsetX, offsetY);
    if (this.intersect.point) {
      this.movement.setWorldStartPoint = this.intersect.point;
    }
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }
  private zoom = (deltaY: number) => {
    const ratio = 1 + (deltaY > 1 ? 0.02 : -0.02);
    this.rotateSphere.pivot.radius *= ratio;
    this.rotateSphere.pivot.radius = MathUtils.clamp(this.rotateSphere.pivot.radius, 100, 2000);
    this.camera.position.setFromSpherical(this.rotateSphere.pivot);
    this.camera.position.add(this.target);
  }
  private chagneView = (deltaY: number) => {
    const direction = Math.sign(deltaY);
    let preProcess = -1;
    this.camera.needTick = true;
    this.camera.tick = (delta: number) => {
      const value = 400 * direction * this.rotateSphere.rotateSpeed * delta;
      const process = this.rotateSphere.rotateVertical(value);
      this.camera.quaternion.copy(this.rotateSphere.current);
      this.camera.position.setFromSpherical(this.rotateSphere.pivot);
      this.camera.position.add(this.target);
      if (process === preProcess) {
        this.camera.needTick = false;
      } else {
        preProcess = process;
      }
    }
  }
  private onMouseWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (this.camera.needTick) { return }
    const { deltaY, ctrlKey } = e;
    if (ctrlKey) {
      this.zoom(deltaY);
    } else {
      this.chagneView(deltaY);
    }
  }
  private initEvents = () => {
    this.canvas.addEventListener('contextmenu', this.onContextMenu);
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('wheel', this.onMouseWheel, { passive: false });
    this.canvas.addEventListener('dblclick', this.onDoubleClick);
    document.addEventListener('keydown', this.onKeydown);
  }
  public dispose = () => {
    this.canvas.removeEventListener('contextmenu', this.onContextMenu);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('wheel', this.onMouseWheel);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('dblclick', this.onDoubleClick);
    document.removeEventListener('pointerup', this.onPointerUp);
    document.removeEventListener('keydown', this.onKeydown);
  }
  public reset = () => {
    this.movement.init();
    this.target.copy(this.targetInit);
    const { x, y, z } = this.movement.cameraStartPos;
    this.rotateSphere.reset(x, y, z);
    this.rotateSphere.resetStart(this.camera.quaternion);
  }
  private initMovement = (obj: Object3D) => {
    // this.movement.updateWorldStartPos(-10000, -10000);
    this.movement.updateDragStartPos(-10000, -10000);
    this.moveTarget(obj, -10000, -10000);
  }
  public drag = (obj: Object3D) => {
    //todo reset pre obj
    this.intersect.reset();
    this.intersect.object = obj;
    this.isMoved = true;
    this.type = Mouse.Left;
    this.initMovement(obj);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }
  public get isFixed() {
    return this._isFixed;
  }
  public set isFixed(type: boolean) {
    this._isFixed = type;
  }
  public set gap(value: number) {
    this._gap = value;
  }
  public set cb(cb: (obj: Object3D | null) => void) {
    this.intersect.cb = cb;
  }
}
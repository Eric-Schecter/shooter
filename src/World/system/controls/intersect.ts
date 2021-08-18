import { Camera, Mesh, MeshBasicMaterial, Object3D, Raycaster, Scene, Vector3 } from "three";
import { TickableMesh } from "../types";

export class Intersect {
  private raycaster = new Raycaster();
  private _object: Object3D | null = null;
  private _point: Vector3 | null = null;
  private _cb = (obj: Object3D | null) => { };
  private isHighlighted = false;
  private backupState = {
    pos: new Vector3(),
  }
  private materialMap = new Map();
  constructor(private canvas: HTMLCanvasElement, private camera: Camera, private scene: Scene,
    private pickArea: Mesh, private selectEffect: Mesh) { }
  private normalize = (px: number, py: number) => {
    const x = px / this.canvas.clientWidth * 2 - 1;
    const y = -(py / this.canvas.clientHeight) * 2 + 1;
    return [x, y];
  }
  private findWrapper = (object: Object3D) => {
    let target = object;
    object.traverseAncestors((obj) => {
      if (obj.name === 'wrapper') {
        target = obj;
      }
    })
    return target;
  }
  public checkIntersectObject = (px: number, py: number) => {
    const [x, y] = this.normalize(px, py);
    this.raycaster.setFromCamera({ x, y }, this.camera);
    const intersects = this.raycaster.intersectObject(this.scene, true);
    const moveables = intersects.filter(({ object }) => object.name === 'moveable');
    if (moveables.length) {
      const [{ object }] = moveables;
      const wrapper = this.findWrapper(object);
      this.object = wrapper;
      this.backupState.pos.copy(wrapper.position);
      wrapper.traverseVisible(obj => {
        if ('moveable' in obj) {
          const { material } = obj as TickableMesh;
          if (Array.isArray(material)) {
            this.materialMap.set(obj, new Array(material.length).map(() => material));
          } else {
            this.materialMap.set(obj, material);
          }
        }
      })
    } else {
      this.object = null;
    }
  }
  public checkIntersectPoint = (px: number, py: number) => {
    const [x, y] = this.normalize(px, py);
    this.raycaster.setFromCamera({ x, y }, this.camera);
    const pickPoints = this.raycaster.intersectObject(this.pickArea);
    if (pickPoints.length) {
      const [{ point }] = pickPoints;
      this._point = point;
      this._point.y = -this._point.y;
    }
  }
  public highlight = () => {
    if (this._object) {
      this._object.traverseVisible(obj => {
        if ('moveable' in obj) {
          (obj as TickableMesh).material = new MeshBasicMaterial({ color: 'red' });
        }
      })
      this.isHighlighted = true;
    }
  }
  public backup = () => {
    if (this._object) {
      this.backupState.pos.copy(this._object.position)
    }
  }
  public reset = () => {
    this._point?.set(-10000, 0, -10000);
  }
  public restoreMaterial = () => {
    if (this._object) {
      this._object.traverseVisible(obj => {
        if ('moveable' in obj) {
          (obj as TickableMesh).material = this.materialMap.get(obj);
        }
      })
      this.isHighlighted = false;
    }
  }
  public restore = () => {
    this._object?.position.copy(this.backupState.pos);
  }
  public get object() {
    return this._object;
  }
  public set object(obj: Object3D | null) {
    const group = obj ? this.findWrapper(obj) : null;
    if(group){
      this.selectEffect.visible = true;
      group.add(this.selectEffect);
    }else{
      this.selectEffect.visible = false;
    }
    this._cb(group);
    this._object = group;
  }
  public get point() {
    return this._point;
  }
  public set cb(fn: (obj: Object3D | null) => any) {
    this._cb = fn;
  }
}
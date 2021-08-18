import { Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three";

export class PickArea {
  private static instance: PickArea;
  public static getInstance = () => {
    if (!PickArea.instance) {
      PickArea.instance = new PickArea();
    }
    return PickArea.instance;
  }
  private constructor() { }
  public create = (size: number) => {
    const geometry = new PlaneBufferGeometry(size, size);
    const material = new MeshBasicMaterial({ transparent: true, opacity: 0 });
    const mesh = new Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    return mesh;
  }
}
import { BoxGeometry, Color, Mesh, MeshStandardMaterial } from "three";

export class Stage {
  public static create = (width: number, height: number, gap: number) => {
    const depth = 20;
    const geometry = new BoxGeometry(width * gap, height * gap, depth);
    const material = new MeshStandardMaterial({ color: new Color('rgb(50,50,50)') });
    const mesh = new Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    mesh.position.y -= depth / 2;
    mesh.receiveShadow = true;
    return mesh;
  }
}
import { BoxBufferGeometry, Mesh, MeshStandardMaterial, sRGBEncoding, TextureLoader } from "three";
import { TickableMesh } from "../system/types";

export class Box {
  private static instance: Box;
  public static getInstance = () => {
    if (!Box.instance) {
      Box.instance = new Box();
    }
    return Box.instance;
  }
  private constructor() { }
  private table = new Map();
  private loader = new TextureLoader()
  private loadTexture = (url: string) => {
    const texture = this.loader.load(`textures/${url}`);
    texture.encoding = sRGBEncoding;
    this.table.set(url, texture);
    return texture;
  }
  public create = (size: number, url: string) => {
    const url1 = `crate0/crate0_diffuse.png`;
    const url2 = `crate0/crate0_normal.png`;
    const url3 = `crate0/crate0_bump.png`;
    const map = this.table.has(url1) ? this.table.get(url1) : this.loadTexture(url1);
    const normalMap = this.table.has(url2) ? this.table.get(url2) : this.loadTexture(url2);
    const bumpMap = this.table.has(url3) ? this.table.get(url3) : this.loadTexture(url3);
    const geometry = new BoxBufferGeometry(size, size, size);
    const material = new MeshStandardMaterial({ map, normalMap, bumpMap });
    const mesh = new Mesh(geometry, material) as TickableMesh;
    mesh.position.setY(size / 2);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.name = 'moveable';
    return mesh;
  }
}
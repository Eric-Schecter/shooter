import { Mesh, MeshStandardMaterial, PlaneBufferGeometry, sRGBEncoding, TextureLoader } from "three";
import { TickableMesh } from "../system/types";

const texture = new TextureLoader().load('images/is600gs.png');
export const createBoard = (size: number, x: number, z: number) => {
  texture.encoding = sRGBEncoding;
  const geometry = new PlaneBufferGeometry(size, size);
  const material = new MeshStandardMaterial({ map: texture });
  const mesh = new Mesh(geometry, material) as TickableMesh;
  mesh.position.set(x, size * 2, z);
  return mesh;
}
import { BoxBufferGeometry, Mesh, MeshStandardMaterial, sRGBEncoding, TextureLoader } from "three";
import { TickableMesh } from "../system/types";

const texture = new TextureLoader().load('textures/hardwood2_diffuse.jpg');
export const createBox = (size: number, x: number, z: number) => {
  texture.encoding = sRGBEncoding;
  const geometry = new BoxBufferGeometry(size, size, size);
  const material = new MeshStandardMaterial({ map: texture });
  const mesh = new Mesh(geometry, material) as TickableMesh;
  mesh.position.set(x, size / 2, z);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}
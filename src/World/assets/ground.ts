import { Mesh, MeshStandardMaterial, PlaneBufferGeometry, RepeatWrapping, sRGBEncoding, TextureLoader } from "three";

const texture = new TextureLoader().load('textures/stone.jpg');
export const createGround = (size: number) => {
  texture.encoding = sRGBEncoding;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(10,10);
  const geometry = new PlaneBufferGeometry(size, size, size);
  const material = new MeshStandardMaterial({ map: texture });
  const mesh = new Mesh(geometry, material);
  mesh.rotateX(-Math.PI / 2);
  return mesh;
}
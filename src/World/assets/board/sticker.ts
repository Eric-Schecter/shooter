
import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

export class Sticker {
  public static create = (size: number) => {
    const height = 50;
    const part1 = new BoxBufferGeometry(size / 5, size / 5, height);
    part1.rotateX(-Math.PI / 2);
    part1.translate(0, height / 2, 0);
    const part2 = new BoxBufferGeometry(size, size, 3);
    part2.rotateX(-Math.PI / 2);
    const geometry = BufferGeometryUtils.mergeBufferGeometries([part1, part2]);
    const material = new MeshStandardMaterial({ color: '#808080' });
    const mesh = new Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
}
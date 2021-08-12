import { BoxGeometry, Mesh, MeshStandardMaterial, ShaderMaterial, Vector2, Vector3 } from "three";
import * as vertexShader from './vertex.vert';
import * as fragmentShader from './fragment.frag';

const createMaterial = (lineWidth: number, gap: number) => {
  const up = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      resolution: { value: new Vector3(1, 1, 1) },
      point: { value: new Vector2(5, 5) },
      lineWidth: { value: lineWidth / 100 },
      size: { value: gap },
    }
  });
  const other = new MeshStandardMaterial({ color: 'grey' });
  return [
    other,
    other,
    other,
    other,
    other,
    other,
  ]
}

export const createStage = (lineWidth: number, width: number, height: number, gap: number) => {
  const depth = 50;
  const geometry = new BoxGeometry(width * gap, height * gap, depth);
  const material = createMaterial(lineWidth, gap);
  const mesh = new Mesh(geometry, material);
  mesh.rotateX(-Math.PI / 2);
  mesh.position.y -= depth / 2;
  mesh.receiveShadow = true;
  return mesh;
}
import { ExtrudeBufferGeometry, Mesh, MeshBasicMaterial, PlaneBufferGeometry, ShaderMaterial, Shape } from "three";
import * as vertexShader from './vertex.vert';
import * as fragmentShader from './fragment.frag';

export class RotateMark {
  private static instance: RotateMark;
  public static getInstance = () => {
    if (!RotateMark.instance) {
      RotateMark.instance = new RotateMark();
    }
    return RotateMark.instance;
  }
  private constructor() { }
  private createMaterial = (size: number) => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        size: { value: size / 2 },
      },
      transparent: true,
    });
  }
  private createGeometry = (size: number) => {
    const shape = new Shape();
    const points = [
      { x: size * 3 / 4, y: 0 },
      // { x: size * 3 / 4, y: size },
      { x: 0, y: size },
      { x: 0, y: size * 5 / 4 },
      { x: -size / 4, y: size },
      { x: 0, y: size * 3 / 4 },
      { x: 0, y: size  },
    ]
    shape.moveTo(size * 3 / 4, 0);
    // shape.arc(0, 0, size / 2, 0, -Math.PI / 2, true);
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i];
      shape.lineTo(p1.x, p1.y);
    }

    // shape.lineTo(size,size/2);

    return new ExtrudeBufferGeometry(shape, {
      depth: 3,
      bevelEnabled: false,
    })
  }
  public create = (size: number) => {
    const geometry = this.createGeometry(size);
    const material = new MeshBasicMaterial({ color: 'yellow' })
    const mesh = new Mesh(geometry, material);
    mesh.position.setY(size);
    mesh.rotation.x = -Math.PI / 2;
    // mesh.visible = false;
    mesh.name = 'arrow';
    return mesh;
  }
}
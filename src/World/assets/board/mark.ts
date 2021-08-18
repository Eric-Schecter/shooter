import { DoubleSide, ExtrudeBufferGeometry, Mesh, MeshPhongMaterial, MeshStandardMaterial, Shader, ShaderChunk, Shape, Texture } from "three";

export class Mark {
  private static instance: Mark;
  public static getInstance = () => {
    if (!Mark.instance) {
      Mark.instance = new Mark();
    }
    return Mark.instance;
  }
  private createGeometry = (size: number) => {
    const shape = new Shape();
    shape.arc(0, 0, size, 0, Math.PI * 2, true);
    const geometry = new ExtrudeBufferGeometry(shape, {
      depth: 3,
      bevelEnabled: false,
      curveSegments: 64,
    });
    return geometry;
  }
  public createMaterials = (texture: Texture) => {
    const icon = new MeshPhongMaterial({ color: '#C0C0C0', map: texture, transparent: true });
    icon.onBeforeCompile = (shader: Shader) => {
      const custom_map_fragment = ShaderChunk.map_fragment.replace(
        `diffuseColor *= texelColor;`,
        `diffuseColor = vec4( mix( diffuse, texelColor.rgb, texelColor.a ), opacity );`
      );
      shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', custom_map_fragment);
    };
    const basic = new MeshStandardMaterial({ color: '#808080', side: DoubleSide });
    return [icon, basic, basic, basic];
  }
  public create = (size: number, texture: Texture) => {
    const box = this.createGeometry(size);
    const material = this.createMaterials(texture);
    const mesh = new Mesh(box, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
}

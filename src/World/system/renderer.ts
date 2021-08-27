import { ACESFilmicToneMapping, PCFSoftShadowMap, sRGBEncoding, WebGLRenderer } from "three";

export class MyRenderer extends WebGLRenderer {
  constructor(container: HTMLElement) {
    super({ antialias: true });
    const { clientWidth: width, clientHeight: height } = container;
    this.toneMapping = ACESFilmicToneMapping;
    this.outputEncoding = sRGBEncoding;
    this.debug.checkShaderErrors = false;
    this.physicallyCorrectLights = true;
    this.shadowMap.enabled = true;
    this.shadowMap.type = PCFSoftShadowMap;
    this.setSize(width, height);
    this.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.domElement);
  }
}
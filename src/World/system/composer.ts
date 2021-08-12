import { Scene, Camera, WebGLRenderer } from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

export const createComposer = (scene: Scene, camera: Camera, renderer: WebGLRenderer) =>{
  const renderScene = new RenderPass(scene, camera);
  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  return composer;
}
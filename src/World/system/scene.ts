import { Color, Scene } from "three";

export const createScene = () => {
  const scene = new Scene();
  scene.background = new Color('rgb(230,230,230)');
  return scene;
}
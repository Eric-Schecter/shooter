import { Color, Scene } from "three";

export const createScene = () => {
  const scene = new Scene();
  scene.background = new Color('rgb(200,200,200)');
  return scene;
}
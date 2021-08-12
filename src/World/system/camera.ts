import { PerspectiveCamera } from "three";
import { TickableMesh } from "./types";

export const createCamera = (canvas: HTMLCanvasElement) => {
  const { clientWidth: width, clientHeight: height } = canvas;
  const camera = new PerspectiveCamera(30, width / height, 0.1, 1000) as PerspectiveCamera & TickableMesh;
  camera.position.set(0, 250, 500);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  return camera;
}
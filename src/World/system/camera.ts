import { PerspectiveCamera } from "three";
import { TickableCamera } from "./types";

export const createCamera = (canvas: HTMLCanvasElement) => {
  const { clientWidth: width, clientHeight: height } = canvas;
  const camera = new PerspectiveCamera(30, width / height, 0.1, 3000) as TickableCamera;
  camera.position.set(1200, 700, 1200);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  return camera;
}
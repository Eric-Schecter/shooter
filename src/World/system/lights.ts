import { AmbientLight, DirectionalLight } from "three";

const createIndirectLights = () => {
  const ambientLight = new AmbientLight('white', 1);
  return [ambientLight];
}

const createDirectLights = () => {
  const directionalLight = new DirectionalLight('white', 2);
  directionalLight.position.set(100,100,100);
  directionalLight.lookAt(0, 0, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -1000;
  directionalLight.shadow.camera.right = 1000;
  directionalLight.shadow.camera.top = -1000;
  directionalLight.shadow.camera.bottom = 1000;
  return [directionalLight];
}

export const createLights = () => {
  const directLights = createDirectLights();
  const indirectLights = createIndirectLights();
  return [...directLights, ...indirectLights];
}
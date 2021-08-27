import { AmbientLight, DirectionalLight, Light } from "three";

export class Lights {
  private _instance: Light[] = [];
  constructor(){
    const directLights = this.createDirectLights();
    const indirectLights = this.createIndirectLights();
    this._instance = [...directLights, ...indirectLights];
  }
  private createIndirectLights = () => {
    const ambientLight = new AmbientLight('white', 0.5);
    return [ambientLight];
  }
  private createDirectLights = () => {
    const directionalLight = new DirectionalLight('white', 1);
    directionalLight.position.set(500, 200, 500);
    return [directionalLight];
  }
  public setPower = (value:number) =>{
    this._instance.forEach(light=>light.intensity = value);
  }
  public get instance() {
    return this._instance;
  }
}
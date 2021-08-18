import { Group } from "three";

type Pos = {
  x: number,
  y: number
}

export type Data = {
  pos: Pos,
  modelID: number,
}

export type DataBase = {
  type: 'model' | 'box',
  name: string,
  url: string,
}

export class MyGroup extends Group {
  public localID = -1;
  public name = 'wrapper'
}
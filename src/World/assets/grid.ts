import { GridHelper } from "three";
import { TickableLine } from "../system/types";

export class Grid {
  private static instance: Grid;
  public static getInstance = () => {
    if (!Grid.instance) {
      Grid.instance = new Grid();
    }
    return Grid.instance;
  }
  private constructor() { }
  public create = (size: number, divisions: number) => {
    const mesh = new GridHelper(size, divisions) as TickableLine;
    mesh.visible = false;
    return mesh;
  }
}
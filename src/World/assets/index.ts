import { Group, Line, Material, Mesh, Object3D, Points, Scene } from 'three';
import { Stage } from './stage';
import { Box } from './box';
import { Board } from './board';
import { SelectEffect } from './selectEffect';
import { Grid } from './grid';
import { PickArea } from './pickArea';
import { Control } from '../system';
import { DataBase, Data, MyGroup } from '../../shared/types';
import { TickableLine } from '../system/types';
import { RotateMark } from './rotateMark';

export class Assets {
  private localID = 0;
  private _map = new Map();
  private _controls?: Control;
  private _database: { [prop: string]: DataBase } = {};
  private grid: TickableLine;
  constructor(private gap: number) {
    this.grid = Grid.getInstance().create(1000, 25);
  }
  private addDisposeEvent = (assets: Array<Mesh | Points | Group | Line>) => {
    assets.forEach(asset => asset.traverse(obj => {
      if (obj.type !== 'Group') {
        obj.addEventListener('dispose', ({ target }) => {
          target.geometry.dispose();
          if (Array.isArray(target.material)) {
            target.material.forEach((material: Material) => material.dispose());
          } else {
            target.material.dispose();
          }
        })
      }
    }))
  }
  private createGroup = (img: string, type: string, x: number, y: number) => {
    const gap = this.gap * 2;
    const board = this.createBoard(img, type);
    const rotateMark = RotateMark.getInstance().create(gap);
    const group = new Group() as MyGroup;
    group.add(board);
    group.position.set(x * gap, 0, y * gap);
    group.name = 'wrapper';
    return group;
  }
  private createBoard = (img: string, type: string) => {
    switch (type) {
      case 'model': {
        return Board.getInstance().create(this.gap, img);
      }
      case 'box': {
        return Box.getInstance().create(this.gap, img);
      }
    }
    return new Object3D();
  }
  public createGroupByID = (id: number) => {
    const { url, type } = this._database[id.toString()];
    const group = this.createGroup(url, type, -1000, -1000);
    this._controls?.drag(group);
    return group;
  }
  public createGroups = (data: { [prop: string]: Data }) => {
    const offsetx = -5;
    const offsety = -8;
    return Object.keys(data)
      .map(id => {
        const d = data[id];
        if (!d) {
          return new Group();
        }
        const { pos: { x, y }, modelID } = data[id];
        const info = this._database[modelID];
        if (!info) {
          return new Group();
        }
        const { url, type } = info;
        const group = this.createGroup(url, type, (x + offsetx) * 2, (y + offsety) * 2);
        group.localID = this.localID;
        this._map.set(this.localID, id);
        this.localID++;
        return group;
      })
  }
  public create = () => {
    const stage = Stage.create(50, 70, this.gap);
    const pickArea = PickArea.getInstance().create(1000);
    const selectEffect = SelectEffect.getInstance().create(this.gap * 2);
    const components = [stage, this.grid, pickArea, selectEffect];
    this.addDisposeEvent(components);
    return { components, stage, grid: this.grid, pickArea,selectEffect };
  }
  public showGrid = (value: boolean) => {
    this.grid.visible = value;
  }
  public set controls(controls: Control) {
    this._controls = controls;
  }
  public set database(data: { [prop: string]: DataBase }) {
    this._database = data;
  }
  public get map() {
    return this._map;
  }
}
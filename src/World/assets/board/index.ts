import { ClampToEdgeWrapping, Group, sRGBEncoding, TextureLoader } from "three";
import { Mark } from "./mark";
import { Sticker } from "./sticker";

export class Board {
  private static instance: Board;
  public static getInstance = () => {
    if (!Board.instance) {
      Board.instance = new Board();
    }
    return Board.instance;
  }
  private constructor() { }
  private table = new Map();
  private loader = new TextureLoader()
  private loadTexture = (url: string) => {
    const texture = this.loader.load(url);
    texture.encoding = sRGBEncoding;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.repeat.set(0.03, 0.03);
    texture.offset.set(0.5, 0.5);
    this.table.set(url, texture);
    return texture;
  }
  public create = (size: number, url: string) => {
    const texture = this.table.has(url) ? this.table.get(url) : this.loadTexture(url);

    const mark = Mark.getInstance().create(size, texture);
    mark.position.setY(size * 2);

    const sticker = Sticker.create(size);

    const group = new Group();
    group.add(mark, sticker);
    group.children.forEach(child => child.name = 'moveable');
    return group;
  }
}
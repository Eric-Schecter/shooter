import { Camera, Line, Mesh } from "three"

export interface TickAble {
  tick?: (delta: number) => any;
  needTick?: boolean;
}

export type TickableMesh = Mesh & TickAble;
export type TickableCamera = Camera & TickAble;
export type TickableLine = Line & TickAble;
import { Camera, Mesh } from "three"

export interface TickAble {
  tick?: (delta: number) => any;
  needTick?: boolean;
}

export type TickableMesh = Mesh & TickAble;
export type TickableCamera = Camera & TickAble;
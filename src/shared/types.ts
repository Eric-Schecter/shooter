import { Object3D } from "three";

export interface Tickable {
  tick?: (delta: number) => void,
}

export interface Hitable {
  power: number;
  hit: (character: Hitable) => void;
}

export interface LifeUnit {
  isDead: boolean;
}

export type Character = Hitable & LifeUnit & Object3D;

export enum State {
  Loading,
  Start,
  Playing,
  End,
}
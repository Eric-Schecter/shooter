import { createStage } from './stage';
import { createBox } from './box';
import { data } from './data';
import { Euler, Group, Material, Mesh, Points, Quaternion } from 'three';
import { createBoard } from './board';
import { createGround } from './ground';

const addDisposeEvent = (assets: Array<Mesh | Points | Group>) => {
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

export const createAssets = () => {
  const stage = createStage(4, 10, 10, 20);

  const boxes = data.map(({ pos: { x, y } }) => createBox(20, (x - 0.5) * 20, (y - 0.5) * 20));
  const boards = data.map(({ pos: { x, y } }) => createBoard(20, (x - 0.5) * 20, (y - 0.5) * 20));
  const groups = data.map(()=>new Group());
  groups.forEach((g,i)=>g.add(boxes[i],boards[i]));

  // const ground = createGround(1000);
  const assets = [stage, ...groups];
  addDisposeEvent(assets);
  return assets;
}
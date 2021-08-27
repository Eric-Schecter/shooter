import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { World } from '../../World';
import styles from './index.module.scss';

type Props = {
  setPoints: Dispatch<SetStateAction<number>>;
  setHP: Dispatch<SetStateAction<number>>;
  setWorld: Dispatch<SetStateAction<World | undefined>>;
}

export const Scene = ({ setPoints, setHP, setWorld }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) { return }
    const getPoint = (value: number) => setPoints(pre => pre + value);
    const getHurt = () => setHP(pre => pre - 1);
    const world = new World(container, getPoint, getHurt);
    setWorld(world);
    return () => {
      world.dispose();
      for (let i = 0; i < container.children.length; i++) {
        container.removeChild(container.children[i]);
      }
    };
  }, [ref, setPoints, setHP, setWorld])

  return <div
    ref={ref}
    className={styles.scene}
  />
}
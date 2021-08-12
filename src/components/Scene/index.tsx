import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { World } from '../../World';
import styles from './index.module.scss';

type Props = {
  setWorld: Dispatch<SetStateAction<World | undefined>>,
}

export const Scene = ({ setWorld }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) { return }
    const world = World.createInstance(container);
    world.start();
    setWorld(world);
    return () => {
      world.dispose();
      for (let i = 0; i < container.children.length; i++) {
        container.removeChild(container.children[i]);
      }
    };
  }, [ref, setWorld])

  return <div ref={ref} className={styles.scene} />
}
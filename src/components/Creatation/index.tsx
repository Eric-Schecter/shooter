import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { DataBase } from '../../shared/types';
import { World } from '../../World';
import styles from './index.module.scss';

type Props = {
  title: string,
  world?: World,
  data?: { [prop: string]: DataBase }
}

export const Creatation = forwardRef(({ world, data }: Props, ref) => {
  const [selected, setSelected] = useState(-1);
  useImperativeHandle(ref, () => ({
    reset() { setSelected(-1) }
  }))
  useEffect(() => {
    if (selected !== -1) {
      world?.create(selected);
    }
  }, [selected, world])
  return <div className={styles.root}>
    <div className={styles.container}>
      {data && Object.values(data).map(({ url, name }, i) =>
        <div
          key={i}
          className={`${styles.wrapper} ${i === selected ? styles.selected : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setSelected(i);
          }}
        >
          <div className={styles.img}>
            <img alt='img' src={url} />
          </div>
          <p className={styles.name}>{name}</p>
        </div>
      )}
    </div >
  </div>
})
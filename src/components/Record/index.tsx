import React from 'react';
import styles from './index.module.scss';

type Props = {
  points: number,
}

export const Record = ({ points }: Props) => {
  return <div className={styles.record}>
    Points:{points}
  </div>
}

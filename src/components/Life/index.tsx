import React from 'react';
import styles from './index.module.scss';

type PropsHeart = {
  isFill: boolean,
}
const Heart = ({ isFill }: PropsHeart) => {
  const fill = isFill ? 'red' : 'grey';
  return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill={fill} stroke='black' viewBox="0 0 24 24">
    <path d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z" />
  </svg>
}

type Props = {
  hp: number,
  initHP: number,
}

export const Life = ({ hp, initHP }: Props) => {
  return <div className={styles.life}>
    {new Array(initHP).fill(0).map((d, i) => <Heart key={i} isFill={i < hp} />)}
  </div>
}

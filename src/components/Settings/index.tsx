import React, { FC } from 'react';
import styles from './index.module.scss';

type Props = {
  title: string
}

export const Settings: FC<Props> = ({ children }) => {

  return <div className={styles.root}>
    {children}
  </div>
}
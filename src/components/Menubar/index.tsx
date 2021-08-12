import React, { FC } from 'react';
import styles from './index.module.scss';

export const Menubar: FC = ({ children }) => {
  return <div className={styles.menubar}>
    {children}
  </div>
}
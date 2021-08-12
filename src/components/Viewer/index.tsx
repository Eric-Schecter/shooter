import React, { FC } from 'react';
import styles from './index.module.scss';

export const Viewer:FC = ({ children }) => {
  return <div className={styles.viewer}>
    {children}
  </div>
}
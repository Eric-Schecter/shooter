import React, { FC, useState } from 'react';
import styles from './index.module.scss';

type Props = {
  name: string,
}

export const MenubarList:FC<Props> = ({ children, name }) => {
  const [isShow, setIsShow] = useState(false);
  return <div
    className={styles.menubarlist}
    onMouseLeave={() => setIsShow(false)}>
    <div
      className={styles.title}
      onMouseEnter={() => setIsShow(true)}
    >
      {name}
    </div>
    <div className={`${styles.options} ${isShow ? styles.show : styles.hide}`}>
      {children}
    </div>
  </div>
}
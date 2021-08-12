import React, { useState, Children, ReactElement } from 'react';
import styles from './index.module.scss';

type Props = {
  children?: ReactElement | ReactElement[],
}

export const Sidebar = ({ children }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return <div className={styles.sidebar}>
    <div className={styles.title}>
      {Children.map(children, (child, i) => <div
        key={i}
        className={i === activeIndex ? styles.active : ''}
        onClick={() => setActiveIndex(i)}
      >
        {child?.props.title}
      </div>)}
    </div>
    <div className={styles.content}>
      {Children.map(children, (child, i) => <div
        key={i}
        className={i === activeIndex ? styles.show : styles.hide}
      >
        {child}
      </div>)}
    </div>
  </div>
}
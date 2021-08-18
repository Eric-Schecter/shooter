import React, { useState, Children, ReactElement, useEffect } from 'react';
import styles from './index.module.scss';

type Props = {
  children?: ReactElement | ReactElement[],
  index: number,
}

export const Sidebar = ({ children, index }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    setActiveIndex(index !== -1 ? 1 : 0);
  }, [index])
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
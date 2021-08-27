import React, { useEffect, useState } from 'react';
import { State } from '../../shared';
import styles from './index.module.scss';

type Props = {
  state: State,
  percent: number
}

export const Content = ({ state, percent }: Props) => {
  const [content, setContent] = useState('');
  useEffect(() => {
    if (state === State.Loading) { return; }
    if (state !== State.Playing) {
      const str = state === State.Start ? 'Click to Start' : 'Click to Restart';
      setContent(str);
    }
  }, [state])

  useEffect(() => {
    if(state === State.Loading){
      setContent(`${percent}%`);
    }
  }, [percent,state])

  return <div className={styles.root}>
    <p>{content}</p>
  </div>
}

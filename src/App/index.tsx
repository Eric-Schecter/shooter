import React, { useEffect, useState } from 'react';
import { Scene, Record, Life, Content } from '../components';
import { initHP, medias, State } from '../shared';
import { World } from '../World';
import styles from './index.module.scss';
import { usePreLoad } from './usePreLoad';

export const App = () => {
  const { isStart, percent } = usePreLoad(medias);
  const [points, setPoints] = useState(0);
  const [hp, setHP] = useState(initHP);
  const [state, setState] = useState(State.Loading);
  const [world, setWorld] = useState<World>();
  const click = () => {
    if (state === State.Start || state === State.End) {
      setState(State.Playing);
      world?.setState(State.Playing);
      if (state === State.End) {
        setHP(initHP);
        setPoints(0);
      }
    }
  }
  useEffect(() => {
    if(isStart){
      setState(State.Start);
    }
  }, [isStart])
  useEffect(() => {
    if (hp <= 0) {
      setTimeout(() => {
        setState(State.End);
      }, 1000);
      world?.setState(State.End);
    }
  }, [hp, world])

  return <div
    className={styles.root}
    onClick={click}
  >
    <Life hp={hp} initHP={initHP} />
    <Record points={points} />
    <Scene setPoints={setPoints} setHP={setHP} setWorld={setWorld} />
    {state !== State.Playing && <Content state={state} percent={percent} />}
  </div>
}
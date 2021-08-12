import React from 'react';
import { Command } from '../../commands';
import styles from './index.module.scss';

type Prop = {
  command: Command,
  name: string,
}

export const MenubarItem = ({ command, name }: Prop) => {
  return <div className={styles.menubaritem} onClick={()=>command.execute()} >
    {name}
  </div>
}
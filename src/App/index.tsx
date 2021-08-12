import React, { useState } from 'react';
import { ChangeViewCommand, FullScreenCommand, RedirectCommand } from '../commands';
import { Menubar, MenubarItem, MenubarList, Scene, Sidebar, Creatation, Information, Settings } from '../components';
import { World } from '../World';
import styles from './index.module.scss';

export const App = () => {
  const [world, setWorld] = useState<World|undefined>();
  return <div className={styles.root}>
    <Menubar >
      <MenubarList name='File'>
        <MenubarItem name='New' command={new ChangeViewCommand(world)} />
        <MenubarItem name='Import' command={new ChangeViewCommand(world)} />
        <MenubarItem name='Export' command={new ChangeViewCommand(world)} />
      </MenubarList>
      <MenubarList name='Edit'>
        <MenubarItem name='Redo(Ctrl+Z)' command={new ChangeViewCommand(world)} />
        <MenubarItem name='Undo(Ctrl+Shift+Z)' command={new ChangeViewCommand(world)} />
        <MenubarItem name='Clear History' command={new ChangeViewCommand(world)} />
      </MenubarList>
      <MenubarList name='View'>
        <MenubarItem name='FullScreen' command={new FullScreenCommand(document)} />
        <MenubarItem name='3D<->2D' command={new ChangeViewCommand(world)} />
        <MenubarItem name='Reset' command={new ChangeViewCommand(world, true)} />
      </MenubarList>
      <MenubarList name='Help'>
        <MenubarItem name='About' command={new FullScreenCommand(document)} />
        <MenubarItem name='Source Code' command={new RedirectCommand(window, 'https://www.baidu.com')} />
      </MenubarList>
    </Menubar>
    <div className={styles.wrapper}>
      <Scene setWorld={setWorld} />
      <Sidebar >
        <Creatation title='Scene' />
        <Information title='Info' />
        <Settings title='Settings' />
      </Sidebar>
    </div>
  </div>
}
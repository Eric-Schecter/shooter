import React, { useEffect, useRef, useState } from 'react';
import { ChangeViewCommand, FullScreenCommand, RedirectCommand } from '../commands';
import { Menubar, MenubarItem, MenubarList, Scene, Sidebar, Creatation, Information, Settings } from '../components';
import { World } from '../World';
import styles from './index.module.scss';
import { useLoadData } from './useLoadData';

export const App = () => {
  const [world, setWorld] = useState<World | undefined>();
  const { data, database } = useLoadData();
  const [index, setIndex] = useState(-1);
  const refCreate = useRef<any>();

  useEffect(() => {
    if (Object.keys(data).length && Object.keys(database).length && world) {
      world.database = database;
      world.create(data);
      world.cb = (id: number) => setIndex(id);
    }
  }, [data, database, world])

  return <div className={styles.root} onClick={() => refCreate.current?.reset()}>
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
      <Sidebar index={index} >
        <Creatation title='Scene' world={world} ref={refCreate} data={database} />
        <Information title='Info' data={data[index]} />
        <Settings title='Settings' />
      </Sidebar>
    </div>
  </div>
}
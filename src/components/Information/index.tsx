import React from 'react';
import styles from './index.module.scss';

type Props = {
  title: string,
  data?: { [prop: string]: string | number | boolean },
}

type PropsItem = {
  type: string,
  content: string | number | boolean,
}

const InfoItem = ({ type, content }: PropsItem) => {
  return <div className={styles.item}>
    <p className={styles.type}>{type}</p>
    <p className={styles.content}>{content}</p>
  </div>
}

export const Information = ({ data }: Props) => {
  const filteredProps = ['modelID', 'pos', 'Alarm', 'JobCard'];
  return <div>
    {data && Object.keys(data).map(prop =>
      !filteredProps.includes(prop) && <InfoItem key={prop} type={prop} content={data[prop]} />)}
  </div>
}
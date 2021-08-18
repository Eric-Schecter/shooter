import { Dispatch, useEffect, useState, SetStateAction } from "react";

export const useLoadData = () => {
  const [data, setData] = useState<{[prop: string]: any }>([]);
  const [database, setDataBase] = useState<{ [prop: string]: any }>({});
  useEffect(() => {
    const fetchData = (url: string, cb: Dispatch<SetStateAction<any[]>>) => {
      fetch(url)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw Error('load data fail');
        })
        .then(res => cb(res))
    }
    fetchData('data/fakeData.json', setData);
    fetchData('data/database.json', setDataBase);
  }, [])
  return { data, database };
}
import { useEffect, useState } from "react";

type Files = {
  audios: { [prop: string]: string },
  images: { [prop: string]: string },
  models: { [prop: string]: string },
}

export const usePreLoad = (files: Files) => {
  const [loaded, setLoaded] = useState(0);
  const [isStart, setIsStart] = useState(false);
  const [total, setTotal] = useState(0);
  const percent = total === 0 ? 0 : Math.floor(loaded / total * 100);

  useEffect(() => {
    const { audios, images, models } = files;
    const audioFiles = Object.values(audios);
    const imageFiles = Object.values(images);
    const modelFiles = Object.values(models);
    const total = audioFiles.length + imageFiles.length + modelFiles.length;
    setTotal(total);
    [...audioFiles, ...modelFiles].forEach(d => {
      const request = new XMLHttpRequest();
      request.open('GET', d, true);
      request.onload = (evt) => {
        setLoaded(pre => pre + 1);
      };
      request.send();
    })
    imageFiles.forEach(d => {
      const img = new Image();
      img.src = d;
      img.onload = () => {
        setLoaded(pre => pre + 1);
      }
    })
  }, [files])

  useEffect(() => {
    if (loaded === total && total !== 0) {
      setTimeout(() => {
        setIsStart(true);
      }, 1000);
    }
  }, [loaded, total])
  return { percent, isStart };
}
export const throttle = (fn: (...args: any) => void, time: number) => {
  let isLocked = false;
  return (...args: any) => {
    if (isLocked) {
      return;
    }
    isLocked = true;
    fn(...args);
    setTimeout(() => {
      isLocked = false;
    }, time);
  }
}

export const debounce = (fn: (...args: any) => void, time: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, time);
  }
}
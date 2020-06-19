// promise 重试
export function retry(func: (...args: any[]) => Promise<any>, max = 1) {
  return (...args: any[]) => {
    let p = func(...args);
    if (max > 1) {
      return p.catch(() => {
        return retry(func, max - 1)(...args);
      });
    }
    return p;
  };
}

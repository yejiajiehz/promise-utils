function remove<T>(arr: T[], item: T) {
  return arr.filter((t) => t !== item);
}

export function queuePromise(fns: (() => Promise<any>)[], max = 5) {
  let queue = [];
  const tail = fns;

  function run() {
    if (tail.length && queue.length < max) {
      const fn = tail.shift();

      fn().then(() => {
        queue = remove(queue, fn);
        run();
      });

      run();
      queue.push(fn);
    }
  }

  run();
}

export async function queuePromiseWithSort(
  fns: ((() => Promise<any>) & { index?: number })[],
  max = 5
) {
  fns.forEach((fn, i) => (fn.index = i));

  let queue = [];
  const tail = fns;
  let result = [];

  return new Promise((resolve, rejcet) => {
    function run() {
      if (tail.length && queue.length < max) {
        const fn = tail.shift();

        fn().then((v) => {
          queue = remove(queue, fn);
          result[fn.index] = v;
          run();
        });

        queue.push(fn);
        run();
      }

      if (queue.length === 0 && tail.length === 0) {
        resolve(result);
      }
    }

    return run();
  });
}

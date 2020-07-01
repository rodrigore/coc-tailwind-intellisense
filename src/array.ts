export function dedupe<T>(arr: Array<T>): Array<T> {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};

export function equal(arr1: any[], arr2: any[]): boolean {
  return (
    JSON.stringify(arr1.concat([]).sort()) ===
    JSON.stringify(arr2.concat([]).sort())
  );
};

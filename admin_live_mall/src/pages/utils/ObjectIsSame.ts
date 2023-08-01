// 判断数据类型

// 判断两个对象是否相等
export function isObjectChanged(source: any, comparison: any): boolean {
  function getDataType(data: any) {
    const temp = Object.prototype.toString.call(data);
    const type: any = temp.match(/\b\w+\b/g);
    return type.length < 2 ? 'Undefined' : type[1];
  }

  // 由于'Object','Array'都属于可遍历的数据类型，所以我们提前定义好判断方法，方便调用
  const iterable = (data: any) => ['Object', 'Array'].includes(getDataType(data));

  // 如果源数据不是可遍历数据，直接抛错，主要用于判断首次传入的值是否符合判断判断标准。
  if (!iterable(source)) {
    throw new Error(`source should be a Object or Array , but got ${getDataType(source)}`);
  }

  // 如果数据类型不一致，说明数据已经发生变化，可以直接return结果
  if (getDataType(source) !== getDataType(comparison)) {
    return true;
  }

  // 提取源数据的所有属性名
  const sourceKeys = Object.keys(source);

  // 将对比数据合并到源数据，并提取所有属性名。
  // 在这里进行对象合并，首先是要保证 对比数据>=源数据，好处一：后边遍历的遍历过程就不用做缺省判断了。
  const comparisonKeys = Object.keys({ ...source, ...comparison });

  // 好处二：如果属性数量不一致说明数据必然发生了变化，可以直接return结果
  if (sourceKeys.length !== comparisonKeys.length) {
    return true;
  }

  // 一旦找到符合条件的值，则会立即return
  return comparisonKeys.some((key) => {
    if (iterable(source[key])) {
      return isObjectChanged(source[key], comparison[key]);
    } else {
      return source[key] !== comparison[key];
    }
  });
}

/**
 *  判断两个数组内的元素是否完全相等，不受顺序影响
 *  @param {Array} arr1
 *   @param {Array} arr2
 *  @return {boolean} 返回布尔值
 */
export const isArrEqual = (arr1: any[], arr2: any[]) => {
  return arr1.length === arr2.length && arr1.every((ele) => arr2.includes(ele));
};

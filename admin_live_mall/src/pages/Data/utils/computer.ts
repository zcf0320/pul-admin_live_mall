/**
 * 将文字写入剪切板
 * @param {number} secondNum  今日
 * @param {number} firstNum  昨日
 * @returns {string} 占昨日全天比例 (today - yesterday) / yesterday)
 */
export function dataComputer(secondObj: any, firstObj: any) {
  const arr1 = Object.entries(secondObj);
  const arr2 = Object.entries(firstObj);
  let obj: any = {};
  arr1.forEach((item1) => {
    arr2.forEach((item2) => {
      if (isNaN(Number(item1[1])) || isNaN(Number(item2[1]))) {
        return;
      }
      if (item1[0] === item2[0]) {
        const keyName = item1[0];
        obj = {
          ...obj,
          [keyName]: dataComputer(Number(item2[1]), Number(item1[1])),
        };
      }
    });
  });
  if (typeof secondObj === 'number' && typeof firstObj === 'number') {
    if (secondObj === 0 && firstObj === 0) {
      return '-';
    }
    if (secondObj === 0 || firstObj === 0) {
      return '0.00%';
    }
    let num: any = ((secondObj - firstObj) / firstObj) * 100;
    num = Number(num).toFixed(2);
    return num + '%';
  }
  return obj;
}

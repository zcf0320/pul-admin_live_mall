/**
 * 将文字写入剪切板
 * @param {string} text
 * @returns {Promise} 返回promise对象
 */
export function copyText(text: string) {
  // 在调用前 先访问是否存在 clipboard 对象
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // 不存在使用 老版本API execCommand
    try {
      const t = document.createElement('textarea');
      t.nodeValue = text;
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }
}

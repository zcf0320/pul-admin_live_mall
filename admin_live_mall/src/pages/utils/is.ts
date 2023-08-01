import { RuleObject } from 'antd/es/form';

export function isArray(val): boolean {
  return Object.prototype.toString.call(val) === '[object Array]';
}
export function isObject(val): boolean {
  return Object.prototype.toString.call(val) === '[object Object]';
}
export function isString(val): boolean {
  return Object.prototype.toString.call(val) === '[object String]';
}
export const isPhone = (rule: RuleObject, value: string, callback: (error?: string) => void) => {
  if (!value || value.length < 11) {
    callback('手机号格式有误');
  } else {
    if (/^(1[3-9][0-9])\d{8}$/.test(value)) {
      callback();
    } else {
      callback('手机号格式有误');
    }
  }
};

export function IsMobileDevice() {
  //获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
  const info = navigator.userAgent;
  //通过正则表达式的test方法判断是否包含“Mobile”字符串
  const isPhone = /mobile/i.test(info);
  //如果包含“Mobile”（是手机设备）则返回true
  return isPhone;
}

export const isSSR = (function () {
  try {
    return !(typeof window !== 'undefined' && document !== undefined);
  } catch (e) {
    return true;
  }
})();

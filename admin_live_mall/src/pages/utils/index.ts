// TypeScrit
export function copyToClipboard(textToCopy: string) {
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // 创建text area
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    // 使text area不在viewport，同时设置不可见
    textArea.style.position = 'absolute';
    textArea.style.opacity = '0';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      // 执行复制命令并移除文本框
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.execCommand('copy') ? res(null) : rej();
      textArea.remove();
    });
  }
}

export const getRandomTagColor = () => {
  const random = Number((Math.random() * 10).toFixed(0)) + 1;
  return [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ][random];
};

export const desensitizedPhone = (phone: string | number) => {
  if (!phone) {
    return '';
  }
  const stringPhone = String(phone);
  return stringPhone.slice(0, 3) + '****' + stringPhone.slice(7, 11);
};

export const changeFavoriteIcon = (url: string) => {
  const icon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (icon) {
    icon.href = url;
  } else {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = url;
    document.head.appendChild(favicon);
  }
};

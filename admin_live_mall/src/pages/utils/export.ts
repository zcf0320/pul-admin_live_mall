/**
 *
 * @param fileName 导出的文件名称
 * @param excelData excel的数据 axios responseType设为 blob
 */
export const exportExcel = (fileName: string, excelData: string) => {
  const blob = new Blob([excelData]);
  const downloadElement = document.createElement('a');
  const href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = `${fileName}.xls`;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
};

/**
 *
 * @param fileName 导出的文件名称
 * @param excelData excel的数据 umi request 使用
 */
export const exportExcelBlob = (fileName: string, excelData: Blob) => {
  const downloadElement = document.createElement('a');
  const href = window.URL.createObjectURL(excelData);
  downloadElement.href = href;
  downloadElement.download = `${fileName}.xls`;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
};

/**
 *
 * @param fileName 导出的文件名称
 * @param href canvas.toDataUrl 产生的base64
 */
export const downloadImage = (fileName: string, href: string) => {
  const downloadElement = document.createElement('a');
  downloadElement.download = `${fileName}.png`;
  downloadElement.href = href;
  downloadElement.target = '_blank';
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
};

/**
 *
 * @param fileName 导出的文件名称
 * @param href 链接
 */
export const downloadExcel = (fileName: string, href: string) => {
  const downloadElement = document.createElement('a');
  downloadElement.href = href;
  const lastName = href.split('.')[href.split('.').length];
  downloadElement.download = `${fileName}.${lastName}`;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
};

export function checkImageWH(fileObj: any, width: number, height: number) {
  return new Promise(function (resolve, reject) {
    // 获取上传的图片的宽高
    const reader = new FileReader();
    reader.onload = function () {
      const replaceSrc = reader.result;
      const imageObj: any = new Image();
      imageObj.src = replaceSrc;
      imageObj.onload = function () {
        if (
          (imageObj.width <= width && imageObj.height <= height) ||
          (imageObj.width === width && imageObj.height === height)
        ) {
          resolve(true);
        } else {
          reject(false);
        }
        // 执行上传的方法，获取外网路径，上传进度等
      };
    };
    reader.readAsDataURL(fileObj.originFileObj);
  });
}

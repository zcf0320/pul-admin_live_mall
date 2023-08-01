const COS = require('cos-js-sdk-v5');
// import type { UploadRequestOption } from 'rc-upload/lib/interface';

// export const cosBucket = 'xindi-1315052641'; /* 填写自己的bucket，必须字段 */
export const cosBucket = 'live-1256309098'; /* 填写自己的bucket，必须字段 */
// export const cosBucket = 'jy-1306780729'; /* 填写自己的bucket，必须字段 */
export const cosRegion = 'ap-shanghai'; /* 存储桶所在地域，必须字段 */
// export const cosRegion = 'ap-nanjing'; /* 存储桶所在地域，必须字段 */
export const cosBaseDir = 'live/media/'; /* 文件所在目录 */

export const cos = new COS({
  // getAuthorization 必选参数
  getAuthorization: function (_: any, callback: any) {
    // 异步获取临时密钥
    // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
    // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
    // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048

    const url = '/admin/file/cosTmpSecret'; // url替换成您自己的后端服务
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function (e: any) {
      const data = JSON.parse(e?.target?.responseText)?.data || null;

      if (!data) {
        return console.error('data invalid:\n' + JSON.stringify(data, null, 2));
      }

      callback({
        TmpSecretId: data.tmpSecretId,
        TmpSecretKey: data.tmpSecretKey,
        SecurityToken: data.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
      });
    };
    xhr.send();
  },
});

function generateUUID() {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export const upload = (e: any) => {
  console.log(e);
  const file: any = e.file;
  const progress = e.onProgress;
  const success = e.onSuccess;
  const error = e.onError;
  const fileName = generateUUID() + file.name;
  /* 直接调用cos sdk的方法 */
  cos.uploadFile(
    {
      Bucket: cosBucket /* 填写自己的bucket，必须字段 */,
      Region: cosRegion /* 存储桶所在地域，必须字段 */,
      Key: `${cosBaseDir}${fileName}` /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
      Body: file, // 上传文件对象
      SliceSize:
        1024 *
        1024 *
        5 /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */,
      onProgress: function (progressData: any) {
        console.log(JSON.stringify(progressData));
        if (progress) {
          progress({ percent: progressData.percent * 100 });
        }
      },
    },
    function (err: any, data: any) {
      console.log('err', err);
      if (err) {
        if (error) {
          error(err, data);
        }
      } else {
        console.log('上传成功', data);
        if (success) {
          success(data);
        }
      }
    },
  );
};

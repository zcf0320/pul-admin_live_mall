// https://www.yuque.com/braft-editor/be/gz44tn

import { BuiltInControlType, ExtendControlType } from 'braft-editor';
import { cos, cosRegion } from './cos';
import { cosBucket } from './cos';
import { cosBaseDir } from './cos';

// 富文本编辑器文件上传方法
export const myUploadFn = (e: any) => {
  console.log(e);
  const file: any = e.file;
  const progress = e.progress;
  const success = e.success;
  const error = e.error;

  /* 直接调用cos sdk的方法 */
  cos.uploadFile(
    {
      Bucket: cosBucket /* 填写自己的bucket，必须字段 */,
      Region: cosRegion /* 存储桶所在地域，必须字段 */,
      Key: `${cosBaseDir}${file.name}` /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
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
      if (err) {
        if (error) {
          error(err, data);
        }
      } else {
        console.log('上传成功', data);
        if (success) {
          success({ url: 'https://' + data.Location });
        }
      }
    },
  );
};
// export const myUploadFn = (param: any) => {
//   console.log('富文本文件上传：', param);
//   let serverURL = '/admin/file/updateLoadAudio';
//   if (String(param?.file?.type.match(/image/i)) === 'image') {
//     serverURL = '/admin/file/updateLoadImage';
//   }
//   const xhr = new XMLHttpRequest();
//   const fd = new FormData();
//   const successFn = () => {
//     // 假设服务端直接返回文件上传后的地址
//     // 上传成功后调用param.success并传入上传后的文件地址
//     param.success({
//       url: JSON.parse(xhr.responseText).data?.url,
//     });
//   };
//   const progressFn = (event: any) => {
//     // 上传进度发生变化时调用param.progress
//     param.progress((event.loaded / event.total) * 100);
//   };
//   const errorFn = () => {
//     // 上传发生错误时调用param.error
//     param.error({
//       msg: 'unable to upload.',
//     });
//   };
//   xhr.upload.addEventListener('progress', progressFn, false);
//   xhr.addEventListener('load', successFn, false);
//   xhr.addEventListener('error', errorFn, false);
//   xhr.addEventListener('abort', errorFn, false);
//   fd.append('uploadFile', param.file);
//   xhr.open('POST', serverURL, true);
//   xhr.setRequestHeader('token', `${localStorage.getItem('token')}`);
//   xhr.send(fd);
// };

//富文本自定义控件
export const extendControls: ExtendControlType[] = [
  {
    key: 'my-title', // 控件唯一标识，必传
    type: 'button',
    title: '这是一个自定义的按钮', // 指定鼠标悬停提示文案
    className: 'my-button', // 指定按钮的样式名
    html: null, // 指定在按钮中渲染的html字符串
    text: '详细内容', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
  },
];

//富文本默认控件名称
export const excludeControls: BuiltInControlType[] = [
  'blockquote',
  'bold',
  'code',
  'clear',
  'emoji',
  'font-family',
  'font-size',
  'fullscreen',
  'headings',
  'hr',
  'italic',
  'letter-spacing',
  'line-height',
  'link',
  'list-ol',
  'list-ul',
  'media',
  'redo',
  'remove-styles',
  'separator',
  'strike-through',
  'superscript',
  'subscript',
  'text-align',
  'text-color',
  'text-indent',
  'underline',
  'undo',
  'table',
];

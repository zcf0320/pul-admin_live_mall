import React, { Ref, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

import { Step2RefContext } from '../step2';
import { Form, FormInstance } from 'antd';
import { myUploadFn } from '@/pages/utils/richTextUpload';

export interface ImageAndTextInstance {
  setEditValue: (html: string) => void;
}

function ImageAndText(props: any, ref: Ref<ImageAndTextInstance>) {
  const { getForm } = useContext(Step2RefContext);
  const editRef = useRef<BraftEditor>(null);
  const [form, setForm] = useState<FormInstance>();

  useImperativeHandle(
    ref,
    () => {
      return {
        setEditValue: (html) => {
          editRef.current?.setValue(BraftEditor.createEditorState(html));
        },
      };
    },
    [],
  );

  useEffect(() => {
    const form = getForm && getForm();
    if (form) setForm(form);
  }, [getForm]);

  return (
    <div>
      {/* <Form.Item
        name={'mainPic'}
        getValueFromEvent={normImage}
        valuePropName="imageUrl"
        rules={[{ required: true, message: '请上传商品主图' }]}
        label="商品主图"
      >
        <UploadPhotos amount={1}></UploadPhotos>
      </Form.Item> */}
      {/* <Form.Item
        tooltip="最多10张，每张不超过10M"
        name={'ringPic'}
        getValueFromEvent={normImage}
        valuePropName="imageUrl"
        rules={[{ required: true, message: '请上传轮播图' }]}
        label="轮播图"
      >
        <UploadPhotos amount={10}></UploadPhotos>
      </Form.Item> */}
      <Form.Item
        name={'detail'}
        label="商品介绍"
        rules={[{ required: true, message: '请填写商品介绍' }]}
      >
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fafafc',
            width: '70%',
          }}
        >
          <BraftEditor
            excludeControls={['fullscreen']}
            ref={editRef}
            contentStyle={{ height: '300px' }}
            media={{ uploadFn: myUploadFn }}
            onChange={(editorState) => {
              // console.log(editorState.toHTML());
              const html = editorState.toHTML();
              form?.setFieldValue('detail', html);
            }}
          />
        </div>
      </Form.Item>
      {/* </Form> */}
    </div>
  );
}

export default React.forwardRef(ImageAndText);

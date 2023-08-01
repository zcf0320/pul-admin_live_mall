import { getDiyAppletSettings, setDiyAppletSettings } from '@/api/diyAppletSettings';
import { UploadPhotos, normImage } from '@/pages/components/UploadPhotos/UploadPhotos';
import { FooterToolbar, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { ColorPicker, Form, message } from 'antd';
import { useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

type PosterSet = PosterSetForm & DraggableInfo;

interface PosterSetForm {
  diyText: string;
  diyTextColor: string;
  posterBgImg: string;
}

interface DraggableInfo {
  tx: { x: number; y: number };
  nc: { x: number; y: number };
  yqm: { x: number; y: number };
  zdy: { x: number; y: number };
  ewm: { x: number; y: number };
}

const draggableInfoInitial = {
  tx: { x: 0, y: 0 },
  nc: { x: 0, y: 55 },
  yqm: { x: 0, y: 75 },
  zdy: { x: 0, y: 95 },
  ewm: { x: 0, y: 115 },
};

export default () => {
  const formRef = useRef<ProFormInstance>();
  const key = 'INVITATION_POSTER';

  const [bgImg, setBgImg] = useState<string>();
  const [text, setText] = useState<string>();
  const [color, setColor] = useState<string>();
  const [draggableInfo, setDraggableInfo] = useState<DraggableInfo>(draggableInfoInitial);

  const handleDrag = (
    _: DraggableEvent,
    data: DraggableData,
    type: '头像' | '昵称' | '邀请码' | '二维码' | '自定义文案',
  ) => {
    // console.log(type);
    // console.log(data.x, data.y);

    const value = {
      x: data.x,
      y: data.y,
    };
    switch (type) {
      case '头像':
        setDraggableInfo({ ...draggableInfo, tx: value });
        break;
      case '二维码':
        setDraggableInfo({ ...draggableInfo, ewm: value });
        break;
      case '昵称':
        setDraggableInfo({ ...draggableInfo, nc: value });
        break;
      case '自定义文案':
        setDraggableInfo({ ...draggableInfo, zdy: value });
        break;
      case '邀请码':
        setDraggableInfo({ ...draggableInfo, yqm: value });
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            position: 'relative', //必须设置，不然 bounds="parent" 无法生效
            marginRight: 40,
            border: '1px solid #d9d9d9',
            boxSizing: 'content-box',
            borderRadius: 15,
            overflow: 'hidden',
            background: '#fff',
            width: 375,
            minHeight: 521,
          }}
        >
          <img src={bgImg} style={{ width: 375 }} />

          {/* https://github.com/react-grid-layout/react-draggable */}
          <Draggable
            bounds="parent"
            onStop={(e, data) => handleDrag(e, data, '头像')}
            position={draggableInfo.tx}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                height: 50,
                width: 50,
                borderRadius: '50%',
                background: '#f5f5f5',
                border: '1px solid rgb(217, 217, 217)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'move',
              }}
            >
              头像
            </div>
          </Draggable>
          <Draggable
            bounds="parent"
            onStop={(e, data) => handleDrag(e, data, '昵称')}
            position={draggableInfo.nc}
          >
            <div style={{ position: 'absolute', top: 0, fontWeight: 'bold', cursor: 'move' }}>
              昵称
            </div>
          </Draggable>
          <Draggable
            bounds="parent"
            onStop={(e, data) => handleDrag(e, data, '邀请码')}
            position={draggableInfo.yqm}
          >
            <div style={{ position: 'absolute', top: 0, fontSize: 10, cursor: 'move' }}>邀请码</div>
          </Draggable>
          <Draggable
            bounds="parent"
            onStop={(e, data) => handleDrag(e, data, '自定义文案')}
            position={draggableInfo.zdy}
          >
            <div style={{ position: 'absolute', top: 0, fontSize: 10, cursor: 'move', color }}>
              {text}
            </div>
          </Draggable>
          <Draggable
            bounds="parent"
            onStop={(e, data) => handleDrag(e, data, '二维码')}
            position={draggableInfo.ewm}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                background: '#f5f5f5',
                height: 100,
                width: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgb(217, 217, 217)',
                cursor: 'move',
              }}
            >
              二维码
            </div>
          </Draggable>
        </div>

        <ProForm<PosterSetForm>
          formRef={formRef}
          request={async () => {
            const res = await getDiyAppletSettings({ keys: [key] });
            if (res.data) {
              const info: PosterSet = JSON.parse(res.data[key]);
              // console.log('info', info);
              if (info) {
                setBgImg(info.posterBgImg);
                setColor(info.diyTextColor);
                setText(info.diyText);
                setDraggableInfo({
                  tx: info.tx,
                  nc: info.nc,
                  yqm: info.yqm,
                  zdy: info.zdy,
                  ewm: info.ewm,
                });
                return info;
              }
            }
            return {} as any;
          }}
          onFinish={async (v) => {
            console.log('表单', v);
            console.log('draggableInfo', draggableInfo);
            const value = JSON.stringify({ ...draggableInfo, ...v });
            console.log('value', value);

            const res = await setDiyAppletSettings({
              settingList: [
                {
                  key,
                  value,
                },
              ],
            });
            if (res.code === 0) {
              message.success('成功！');
            }
          }}
          submitter={{
            resetButtonProps: false,
            render: (_, dom) => (
              <FooterToolbar
                style={{
                  left: 0,
                  zIndex: 999,
                  marginLeft: '110px',
                  width: 'calc(100% - 110px)',
                }}
                extra={
                  <div
                    style={{
                      width: '100%',
                      paddingBlock: 15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {dom}
                  </div>
                }
              />

              // 自定义footer
              // <div
              //   style={{
              //     position: 'fixed',
              //     left: '0px',
              //     bottom: 0,
              //     width: 'calc(100% - 110px)',
              //     marginLeft: '110px',
              //     zIndex: 999,
              //     insetInlineEnd: 0,
              //     display: 'flex',
              //     alignItems: 'center',
              //     justifyContent: 'center',
              //     paddingInline: 24,
              //     paddingBlock: 15,
              //     boxSizing: 'border-box',
              //     lineHeight: 64,
              //     backgroundColor: 'rgba(255, 255, 255, 0.6)',
              //     borderBlockStart: '1px solid rgba(5, 5, 5, 0.06)',
              //     WebkitBackdropFilter: 'blur(8px)',
              //     backdropFilter: 'blur(8px)',
              //     color: 'rgba(0, 0, 0, 0.88)',
              //     transition: 'all 0.2s ease 0s',
              //   }}
              // >
              //   {dom}
              // </div>
            ),
          }}
        >
          <Form.Item
            label="背景图"
            name="posterBgImg"
            valuePropName="imageUrl"
            getValueFromEvent={normImage}
            rules={[{ required: true, message: '请上传背景图' }]}
          >
            <UploadPhotos
              amount={1}
              onChange={(e) => {
                const url = normImage(e);
                setBgImg(url);
                if (!url) {
                  setDraggableInfo(draggableInfoInitial);
                }
              }}
            >
              <div style={{ fontSize: 12, color: '#999' }}>
                建议尺寸375*812（iPhone X 全屏宽高）
              </div>
            </UploadPhotos>
          </Form.Item>

          {/* <ProFormText name="posterBgImg" label="背景图" /> */}

          <ProFormText
            name="diyText"
            label="引导文案"
            fieldProps={{
              onChange: (e) => {
                setText(e.target.value);
              },
            }}
            addonAfter={
              <Form.Item noStyle name="diyTextColor" getValueFromEvent={(_, hex: string) => hex}>
                <ColorPicker onChange={(_, hex) => setColor(hex)} />
              </Form.Item>
            }
          />

          <div style={{ fontSize: 12, color: '#999' }}>
            卡片内容可在左侧编辑框中拖动以调整位置。保存后，团长在手机端更新即可生效。
          </div>
        </ProForm>
      </div>
    </>
  );
};

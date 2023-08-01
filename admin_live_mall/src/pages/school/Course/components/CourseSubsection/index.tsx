import { useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProList,
} from '@ant-design/pro-components';
import { Button, Form, message, Popconfirm, Tag } from 'antd';

import { table, add, edit, remove } from './service';
import type { TableListItem } from './data';
import MultimediaUpload, {
  normMultimedia,
} from '@/pages/components/MultimediaUpload/MultimediaUpload';

//https://procomponents.ant.design/components/list
const CourseSubsection = (props: any) => {
  const { courseId } = props;
  const [isEdit, setIsEdit] = useState<TableListItem | undefined>(undefined);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>();
  const [fileType, setFileType] = useState<string>('audio/mp3');
  const [sourceUrl, setSourceUrl] = useState<string | undefined>();
  const [courseTime, setCourseTime] = useState<number | undefined>();

  const tableRef = useRef<ActionType>();
  const reloadTable = () => {
    tableRef.current?.reload();
  };

  const dataSource = tableData?.map((item: any) => {
    return { ...item, title: item.subsectionTitle };
  });

  const getCourseTime = (url: string) => {
    console.log('ccc:', url);

    const audio = new Audio(url) as HTMLAudioElement;
    if (audio) {
      audio.addEventListener('loadedmetadata', function () {
        console.log('课程时长:', audio.duration);
        setCourseTime(audio.duration);
        return;
      });
    }
    setCourseTime(undefined);
  };

  //新建
  const addItem = () => {
    return (
      <ModalForm
        key="addItem"
        title={isEdit ? '编辑小节' : '新建小节'}
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建小节
          </Button>
        }
        initialValues={isEdit || { sourceType: 1 }}
        visible={addModalVisible}
        onVisibleChange={(visible) => {
          setAddModalVisible(visible);
          if (!visible) {
            setIsEdit(undefined);
            setSourceUrl(undefined);
            setCourseTime(undefined);
          }
        }}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        onFinish={async (values) => {
          let res = null;
          if (isEdit) {
            res = await edit({ ...values, id: isEdit.id, courseId, courseTime });
          } else {
            res = await add({
              ...values,
              courseId,
              courseTime,
            });
          }
          if (res?.code === 0) {
            message.success(`${isEdit ? '编辑' : '新建'}成功！`);
            reloadTable();
          } else {
            message.error(`${isEdit ? '编辑' : '新建'}失败！`);
            return false;
          }
          return true;
        }}
      >
        <ProFormText name="subsectionTitle" label="课程小节标题" rules={[{ required: true }]} />
        <ProFormText
          name="sourceUrl"
          label="资源链接地址"
          rules={[{ required: true }]}
          fieldProps={{
            onChange: (e) => {
              setSourceUrl(e.target.value);
              getCourseTime(e.target.value);
            },
          }}
        />
        <ProForm.Group>
          <ProFormSelect
            name="sourceType"
            label="文件类型"
            request={async () => [
              { label: '音频', value: 1 },
              { label: '视频', value: 2 },
            ]}
            fieldProps={{
              onChange: (value) => {
                if (value === 1) {
                  setFileType('audio/mp3');
                } else {
                  setFileType('video/mp4');
                }
              },
            }}
          />
          <Form.Item
            label="上传文件"
            tooltip="最多只能上传一个格式为.mp3或.mp4的文件哦~"
            name="sourceUrl"
            valuePropName="sourceUrl"
            getValueFromEvent={normMultimedia}
            rules={[{ required: true, message: '请上文件' }]}
          >
            <MultimediaUpload
              accept={fileType}
              onChange={(e) => {
                console.log('111', e);
                setSourceUrl('https://' + e.response.Location);
                getCourseTime('https://' + e.response.Location);
                normMultimedia(e);
              }}
            />
          </Form.Item>
          <ProFormDigit
            name="sort"
            label="排序"
            tooltip="越大越靠前"
            fieldProps={{ precision: 0 }}
          />
        </ProForm.Group>
        <div>
          {courseTime ? (
            <div>文件预览【总时长：{courseTime}s】</div>
          ) : (
            <div>请核实文件是否上传或是否正确！</div>
          )}
          <br />
          {fileType === 'audio/mp3' ? (
            sourceUrl ? (
              <audio controls src={sourceUrl} id="audio">
                您的浏览器不支持播放该媒体，推荐使用Chrome浏览器。
              </audio>
            ) : (
              ''
            )
          ) : sourceUrl ? (
            <video height="200" controls src={sourceUrl} id="audio">
              您的浏览器不支持播放该媒体，推荐使用Chrome浏览器。
            </video>
          ) : (
            ''
          )}
        </div>
      </ModalForm>
    );
  };

  return (
    <ProList<TableListItem>
      rowKey="id"
      headerTitle="课程小节"
      split={true}
      itemLayout="vertical"
      actionRef={tableRef}
      dataSource={dataSource}
      toolBarRender={() => [addItem()]}
      request={async (params) => {
        const res = await table({ ...params, courseId });
        setTableData(res?.data);
        return res?.data;
      }}
      metas={{
        title: {},
        description: {
          render: (_: any, record: TableListItem) => (
            <>
              <Tag>ID：{record.id}</Tag>
              <Tag>{record.sourceType === 1 ? '音频' : '视频'}</Tag>
              <Button
                key="update"
                size="small"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {
                  setAddModalVisible(true);
                  setIsEdit(record);
                  setSourceUrl(record.sourceUrl);
                  setCourseTime(record.courseTime);
                  setFileType(record.sourceType === 1 ? 'audio/mp3' : 'video/mp4');
                }}
              />
              &nbsp;&nbsp;
              <Popconfirm
                key="delete"
                title={`确认删除【${record.subsectionTitle}】吗?`}
                onConfirm={async () => {
                  const res = await remove({ id: record.id });
                  if (res.code === 0) {
                    message.success('删除成功！');
                    reloadTable();
                  } else {
                    message.error('删除失败！');
                  }
                }}
              >
                <Button size="small" shape="circle" icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          ),
        },
        extra: {
          render: (_: any, record: TableListItem) => (
            <>
              {record.sourceType === 1 ? (
                <audio controls src={record.sourceUrl}>
                  您的浏览器不支持播放该媒体，推荐使用Chrome浏览器。
                </audio>
              ) : (
                <video height="200" controls src={record.sourceUrl}>
                  您的浏览器不支持播放该媒体，推荐使用Chrome浏览器。
                </video>
              )}
            </>
          ),
        },
        content: {
          render: (_: any, record: TableListItem) => {
            return (
              <div>
                <span>排序（越大越靠前）：{record.sort}</span>
                <br />
                <span>创建时间：{record.createTime}</span>
                <br />
                <span>修改时间：{record.modifyTime}</span>
                <br />
              </div>
            );
          },
        },
      }}
    />
  );
};

export default CourseSubsection;

import { useEffect, useState } from 'react';
import { PageContainer, DragSortTable } from '@ant-design/pro-components';
import { MenuOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, message, Radio, Switch } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { UploadEquityPhotos, normImage } from './components/UploadEquityPhotos/UploadEquityPhotos';
// import { history } from '@umijs/max';
import { equityList, addEquity, editsEquity } from './services';
import { ProColumns, TableListItem, imgType } from './data';
import './index.less';
const headerTitle = '成长值设置 可以配置会员权益，帮助维持会员忠诚度，保持会员活跃和粘性，提高复购';

// interface fromType {
//   type: string;
//   record?: () => void;
// }

const imgList = [
  {
    id: 1,
    img: '//img12.360buyimg.com/saasmember/jfs/t1/185314/40/17739/5068/610b9002Ee7262a27/17860c29fdb9e23c.png',
  },
  {
    id: 2,
    img: '//img12.360buyimg.com/saasmember/jfs/t1/185268/37/17675/6675/610b8bb8E12074f33/57d70e2594b23eb1.png',
  },
  {
    id: 3,
    img: '//img13.360buyimg.com/saasmember/jfs/t1/178978/10/17909/7362/610b8fd3Ef34ee596/a6725a5237c45c19.png',
  },
  {
    id: 4,
    img: '//img10.360buyimg.com/saasmember/jfs/t1/185160/9/17809/7240/610b8b46E6c60f4ce/efea3a5fc8a09847.png',
  },
  {
    id: 5,
    img: '//img13.360buyimg.com/saasmember/jfs/t1/188949/5/16946/6457/610b89c7E964bdf1c/2f8c953a2e7d7943.png',
  },
];
const arrImgList = [
  '//img12.360buyimg.com/saasmember/jfs/t1/185314/40/17739/5068/610b9002Ee7262a27/17860c29fdb9e23c.png',
  '//img12.360buyimg.com/saasmember/jfs/t1/185268/37/17675/6675/610b8bb8E12074f33/57d70e2594b23eb1.png',
  '//img13.360buyimg.com/saasmember/jfs/t1/178978/10/17909/7362/610b8fd3Ef34ee596/a6725a5237c45c19.png',
  '//img10.360buyimg.com/saasmember/jfs/t1/185160/9/17809/7240/610b8b46E6c60f4ce/efea3a5fc8a09847.png',
  '//img13.360buyimg.com/saasmember/jfs/t1/188949/5/16946/6457/610b89c7E964bdf1c/2f8c953a2e7d7943.png',
];
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 0 },
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const imgIcon =
  '//img12.360buyimg.com/saasmember/jfs/t1/185314/40/17739/5068/610b9002Ee7262a27/17860c29fdb9e23c.png';
const imageWH = {
  width: 150,
  height: 150,
};
const imgSize = 500;
const EquityManage = () => {
  const [dataSource, setDatasource] = useState([]);
  const [open, setOpen] = useState(false);
  const [equity, setEquity] = useState('');
  const [activeIndex, setActiveIndex] = useState('');
  const [redioIcon, setRedioIcon] = useState(1);
  const [equityStatusFlag, setEquityStatusFlag] = useState(true);
  const [equityIcon, setEquityIcon] = useState('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [editFormData, setEditFormData] = useState<TableListItem>({
    createId: '',
    createTime: '',
    icon: '',
    id: '',
    isDelete: false,
    modifyId: '',
    modifyTime: '',
    name: '',
    rightsDesc: '',
    shopId: '',
    status: false,
    tenantId: '',
    type: -1,
  });
  const [showLoading, setShowoading] = useState(false); // 加载loading

  const [form] = Form.useForm();

  useEffect(() => {
    let arr = imgList.filter((v) => v.img.includes(editFormData.icon));

    if (arr.length) {
      setActiveIndex(activeIndex);
      setEquityIcon(activeIndex);
      setFileUrl(arrImgList.includes(editFormData.icon) ? '' : editFormData.icon);
    } else {
      setActiveIndex(!arrImgList.includes(activeIndex) ? imgIcon : activeIndex);
    }
  }, [redioIcon, equityIcon, fileUrl, activeIndex]);

  // 获取数据
  const getEquityList = () => {
    setShowoading(true);
    equityList()
      .then((res) => {
        setDatasource(res.data);
      })
      .finally(() => {
        setShowoading(false);
      });
  };
  useEffect(() => {
    getEquityList();
  }, []);
  const domFrom = (row: { type: string; record?: TableListItem }) => {
    const { type, record } = row;
    if (type === 'edit') {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };
  // 改变全局开关状态
  const handSetStatus = (val: TableListItem) => {
    editsEquity({ id: val.id, status: val.status ? 0 : 1 }).then((res: any) => {
      if (res.message === 'SUCCESS') {
        message.success('修改成功');
        getEquityList();
      }
    });
  };
  // 跳转页面
  // const handPreferential = () => {
  //   history.push('/Marketing/CouponList');
  // };
  //   编辑
  const editEquity = (record: TableListItem) => {
    setId(record.id);
    setEquity('编辑自定义权益');
    domFrom({ type: 'edit', record });
    setEquityStatusFlag(record.status);
    setEditFormData(record);
    setFileUrl(record.icon);
    setEquityIcon(record.icon);
    setActiveIndex(record.icon);
    setOpen(true);
  };
  const columns: ProColumns[] = [
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '权益名称',
      dataIndex: 'name',
      className: 'drag-visible',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text: TableListItem, record: TableListItem) => {
        return <div>{record.type === 1 ? '通用权益' : '-'}</div>;
      },
    },
    {
      title: '说明',
      dataIndex: 'rightsDesc',
    },
    {
      title: '全局开关',
      dataIndex: 'status',
      render: (text: string, record: TableListItem) => {
        return (
          <Switch
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked={record.status}
            onChange={() => handSetStatus(record)}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      render: (text: string, record: TableListItem) => {
        return (
          <div>
            <Button type="link" onClick={() => editEquity(record)}>
              编辑
            </Button>
            {/* <Button type="link" onClick={() => handPreferential()}>
              创建{record?.name}
            </Button> */}
          </div>
        );
      },
    },
  ];

  //   新增抽屉开关
  const showDrawer = () => {
    setRedioIcon(1);
    setId('');
    setEquity('新增自定义权益');

    setEquityIcon(imgIcon);
    setFileUrl('');
    setActiveIndex(imgIcon);
    domFrom({ type: 'add' });

    form.resetFields();
    setEquityStatusFlag(true);
    setOpen(true);
  };

  //   抽屉开关
  const onClose = async () => {
    await form.resetFields();
    setRedioIcon(1);
    setOpen(false);
  };

  //   表单保存
  const onFinish = () => {
    let obj = {
      ...form.getFieldsValue(),
      // rightsDesc: form.getFieldsValue().rightsDesc,
      icon: form.getFieldsValue().call === undefined ? equityIcon : form.getFieldsValue().call,
      status: equityStatusFlag ? 1 : 0,
    };

    delete obj.call;
    if (id) {
      if (redioIcon === 2 && !form.getFieldsValue().call) {
        return;
      } else {
        editsEquity({
          ...form.getFieldsValue(),
          // rightsDesc: form.getFieldsValue().rightsDesc,
          icon: form.getFieldsValue().call === undefined ? equityIcon : form.getFieldsValue().call,
          id: editFormData.id,
          // name: form.getFieldsValue().name,
          status: form.getFieldsValue().status ? 1 : 0,
        })
          .then((res) => {
            try {
              if (res.message === 'SUCCESS') {
                message.success('编辑成功');
                setRedioIcon(1);
                getEquityList();
                setOpen(false);
              }
            } catch (error) {
              console.log(error);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      addEquity(obj)
        .then((res) => {
          if (res.message === 'SUCCESS') {
            setRedioIcon(1);
            setFileUrl('');
            form.resetFields();
            setEquityIcon('');
            message.success('新增成功');
            getEquityList();
            setOpen(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  // 获取上传的文件地址
  const setImageUrl = (fileList: any[]) => {
    if (fileList.length === 0) {
      setFileUrl('');
      form.setFieldValue('call', '');
    }
    const url = normImage(fileList);

    if (url) {
      form.setFieldValue('call', url);
      form.validateFields().then(() => {
        setFileUrl(url);
      });
    }
  };
  //   表单取消
  const onDrawerNo = () => {
    form.resetFields();
    setRedioIcon(1);
    setOpen(false);
  };
  //   编辑权益状态开关
  const onChangeEditFlag = (checked: boolean) => {
    setEquityStatusFlag(checked);
  };
  //   自定义图标
  const onChangeRedioIcon = (e: RadioChangeEvent) => {
    // setEquityIcon('');
    setRedioIcon(e.target.value);
  };

  const handleDragSortEnd = (newDataSource: any) => {
    setDatasource(newDataSource);
    message.success('修改列表排序成功');
  };
  //   选择默认图片
  const onAddImg = (v: imgType) => {
    setActiveIndex(v.img);
    setEquityIcon(v.img);
  };
  // 自定义拖拽图标
  const dragHandleRender = (rowData: any, idx: number) => (
    <div style={{ userSelect: 'none' }}>
      <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
      &nbsp;{idx + 1}
    </div>
  );

  return (
    <>
      <PageContainer
        header={{
          breadcrumb: undefined,
        }}
        extraContent={headerTitle}
      >
        {/* <ProTable></ProTable> */}
        <DragSortTable
          headerTitle={
            <Button type="primary" onClick={showDrawer}>
              新增自定义权益
            </Button>
          }
          columns={columns}
          rowKey="id"
          search={false}
          loading={showLoading}
          // pagination={false}
          dataSource={dataSource}
          dragSortKey="sort"
          dragSortHandlerRender={dragHandleRender}
          onDragSortEnd={handleDragSortEnd}
          options={false}
          scroll={{ x: 1000 }}
        />
      </PageContainer>
      <Drawer width="800px" title={equity} placement="right" onClose={onClose} open={open}>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          initialValues={{ icon: redioIcon, prefix: '86' }}
          style={{ maxWidth: 600 }}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="权益名称"
            rules={[
              {
                required: true,
                message: '请输入权益名称!',
              },
            ]}
          >
            <Input maxLength={5} showCount />
          </Form.Item>

          <Form.Item
            name="icon"
            label="权益图标"
            rules={[
              {
                required: true,
                message: '请上传图片',
              },
            ]}
          >
            <Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请输入上传图片!',
                  },
                ]}
              >
                <Radio.Group
                  onChange={onChangeRedioIcon}
                  value={redioIcon}
                  style={{ margin: '5px 0 0 0', display: 'flex', flexDirection: 'column' }}
                >
                  <Radio value={1} defaultChecked={true}>
                    默认图标
                  </Radio>
                  {redioIcon === 1 ? (
                    <div className="equityImg">
                      {imgList.length &&
                        imgList.map((v) => {
                          return (
                            <div key={v.id} className={`${activeIndex === v.img ? 'active' : ''}`}>
                              <img onClick={() => onAddImg(v)} src={v.img} alt="" />
                            </div>
                          );
                        })}
                    </div>
                  ) : null}

                  <Radio style={{ margin: '20px 0 0 0 ' }} value={2}>
                    自定义
                  </Radio>
                </Radio.Group>
                {redioIcon === 2 ? (
                  <div style={{ margin: '10px 0 0 0 ' }}>
                    <div>
                      <p>图片尺寸要求150px*150px，只支持png格式，大小在{imgSize}kb以内</p>
                      <UploadEquityPhotos
                        amount={1}
                        onChange={setImageUrl}
                        imageUrl={fileUrl}
                        imageWH={imageWH}
                        imgSize={imgSize}
                      ></UploadEquityPhotos>
                    </div>
                  </div>
                ) : null}
              </Form.Item>
              {redioIcon === 2 ? (
                <Form.Item
                  name="call"
                  rules={[
                    {
                      required: true,
                      message: '请上传图片!',
                    },
                  ]}
                >
                  {/* {redioIcon === 2 ? <Input className="inp" /> : null} */}
                  <Input className="inp" />
                </Form.Item>
              ) : null}
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="rightsDesc"
            label="权益描述"
            rules={[{ required: true, message: '请输入权益描述!' }]}
          >
            <Input.TextArea showCount maxLength={50} />
          </Form.Item>
          <Form.Item name="status" label="权益状态" valuePropName="checked">
            <Switch
              onChange={onChangeEditFlag}
              checkedChildren="开启"
              unCheckedChildren="关闭"
              defaultChecked={equityStatusFlag}
            />
          </Form.Item>
          {/* <Form.Item name="benefitLink" label="权益链接">
            <Input placeholder="请输入您店铺下selling.cn域名的链接" />
          </Form.Item> */}
          <Form.Item {...tailFormItemLayout}>
            <Button style={{ margin: '0 20px 0 0' }} onClick={() => onDrawerNo()}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" onClick={onFinish}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default EquityManage;

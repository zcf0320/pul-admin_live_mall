import { FC, memo, useEffect, useRef, useState } from 'react';
import { Alert, Avatar, Button, Image, message, Modal, Popover, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { TableListItem } from '../data';
import {
  ModalForm,
  ProForm,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import styles from './index.module.less';

interface IProps {
  id: string;
  readonly name: string;
  readonly phone: string;
  readonly level: number;
  readonly levelName: string;
  readonly remarkName: string;
  readonly tutorId: string;
  readonly supName: string;
  readonly supId: string;
  showOperate: boolean;
  setShowOperate: any;
  setRefresh: any;
  operateType: string;
  modelTexts: any[];
}

interface IAccount {
  id: string;
  image: string;
  name: string;
}

// 修改备注名
const OperateModel: FC<IProps> = (props: IProps) => {
  const {
    id = '',
    name = '',
    phone = '',
    remarkName = '',
    setShowOperate,
    setRefresh,
    showOperate = false,
    operateType = '',
    modelTexts = [],
    tutorId = '',
    supName = '',
    supId = '',
  } = props || {};
  const texts = modelTexts.find((item) => item.type === operateType); // 当前匹配的文本信息

  const formRef = useRef<ProFormInstance>();
  const [isShowSelect, setIsShowSelect] = useState<boolean | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableList, setTableList] = useState<TableListItem[]>([]);
  const [requestParams, setRequestParams] = useState<{ pageNo: number; pageSize: number }>({
    pageNo: 1,
    pageSize: 5,
  });
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectObj, setSelectObj] = useState<{
    defaultAccount: IAccount;
    otherAccount: IAccount;
  }>({
    defaultAccount: {
      id: '',
      image: '',
      name: '',
    },
    otherAccount: {
      id: '',
      image: '',
      name: '',
    },
  }); // 选择的对象

  const columns: any[] = [
    {
      title: '团长信息',
      align: 'center',
      width: 100,
      render: (_: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ width: 40, height: 40, borderRadius: '50%' }}
              src={record.image}
              preview={false}
            />

            <div
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                marginLeft: 8,
                color: 'rgba(0, 0, 0, 0.65)',
                whiteSpace: 'nowrap',
              }}
            >
              <div>{record.name || '-'}</div>
              <div>{record?.id}</div>
              <div>{record.phone || '-'}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '加入时间',
      dataIndex: 'createTime',
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      valueType: 'option',
      align: 'center',
      width: 100,
      render: (_: any, record: TableListItem) => {
        return (
          // 系统默认账号和自己不可以选择
          !record?.isDefault && record?.id !== id ? (
            <Button
              type="link"
              onClick={() => {
                setSelectObj({
                  ...selectObj,
                  otherAccount: { ...record },
                });
                setShowTable(false);
              }}
            >
              选择
            </Button>
          ) : (
            <span>不可选</span>
          )
        );
      },
    },
  ];
  const getTableList = async (value?: any) => {
    const requestMethod = texts?.method || null;
    // isClear false 没有清退 status 状态正常
    let params: any = {
      ...requestParams,
      status: false,
      isClear: false,
      ...value,
    };
    if (!requestMethod) return;
    try {
      setLoading(true);
      // const res = await requestMethod({ ...requestParams, pageSize: 100000 });
      const {
        data: { records = [], total = 0 },
      } = await requestMethod(params);
      const defaultAccount = records?.find((item: TableListItem) => item.isDefault); // 系统默认账号
      setSelectObj({
        ...selectObj,
        defaultAccount,
      });
      setTableList(records);
      setTotal(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const setAccountInfo = async () => {
    const setMethod = texts?.setMethod || null;
    const otherId = isShowSelect ? selectObj?.otherAccount.id : selectObj?.defaultAccount?.id;
    let messageText = '';
    let keyName = '';
    if (texts?.type === 'CHANGE_PARTNER') {
      keyName = 'partnerId';
      messageText = '变更合伙人成功';
    } else if (texts?.type === 'CLEAR') {
      keyName = 'toTeamId';
      messageText = '已清退当前团长';
    } else {
      keyName = 'tutorId';
      messageText = '变更客户经理成功';
    }
    const params: any = {
      [texts?.currentIdName]: id,
      [keyName]: otherId,
    };
    if (!setMethod) return;
    try {
      await setMethod(params);
      setShowOperate(false);
      setRefresh();
      message.success(messageText);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (showOperate) getTableList();
  }, [requestParams, isShowSelect]);
  return (
    <ModalForm
      width={500}
      layout="inline"
      title={texts?.title}
      formRef={formRef}
      open={showOperate}
      onOpenChange={(visible) => {
        setShowOperate(visible);
        setIsShowSelect(false);
        formRef.current?.setFieldValue(texts?.optionName, '1');
      }}
      onValuesChange={(value) => {
        const isShowSelect = value[texts.optionName] === '2';
        setIsShowSelect(isShowSelect);
        setRequestParams({
          pageNo: 1,
          pageSize: 5,
        });
        if (isShowSelect) {
          setSelectObj({
            ...selectObj,
            otherAccount: {
              id: '',
              image: '',
              name: '',
            },
          });
        }
      }}
      onFinish={setAccountInfo}
    >
      {texts?.alert && (
        <Alert
          message="清退合伙人后，已产生团队订单会继续结算"
          type="warning"
          showIcon
          style={{ width: '100%' }}
        />
      )}
      <div className={styles.remarkModel}>
        <Popover
          content={
            <div className={styles.popover}>
              <div>昵称：{remarkName || name}</div>
              <div>手机号：{phone ?? '-'}</div>
            </div>
          }
          title=""
          trigger="hover"
        >
          <div className={styles.remarkModelInfo}>
            团长信息：{name ?? '-'}（ID:{id ?? '-'}）
          </div>
        </Popover>
        {texts?.secondText && (
          <div className={styles.remarkModelInfo}>
            {texts?.secondText}：
            {texts?.operateType === 'CHANGE_PARTNER' ? supName ?? '-' : supName ?? '-'}
            （ID：{texts?.operateType === 'CHANGE_PARTNER' ? supId ?? '-' : tutorId ?? '-'}）
          </div>
        )}
        <ProFormRadio.Group
          initialValue={'1'}
          name={texts?.optionName}
          layout="vertical"
          label={`${texts?.type === 'CLEAR' ? '团队成员转移给' : '变更为'}`}
          options={[
            { value: '1', label: '总部' },
            { value: '2', label: `其他${texts?.identity}` },
          ]}
        />
        {isShowSelect ? (
          tableList.length !== 1 || !tableList[0].isDefault ? (
            <div style={{ marginTop: 20, whiteSpace: 'nowrap', color: '#333' }}>
              {selectObj?.otherAccount?.id ? (
                <div>
                  <Avatar src={selectObj?.otherAccount?.image} size={30} />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span>
                    {selectObj?.otherAccount?.name}（ID：{selectObj?.otherAccount?.id}）
                  </span>
                  <div
                    onClick={() => setShowTable(true)}
                    style={{ color: '#2e74ff', marginTop: 10 }}
                  >
                    重新选择
                  </div>
                </div>
              ) : (
                <span style={{ color: '#2e74ff' }} onClick={() => setShowTable(true)}>
                  请选择{texts?.identity}
                </span>
              )}
            </div>
          ) : (
            <div style={{ color: '#2e74ff', marginTop: 10 }}>暂无其他{texts?.identity}</div>
          )
        ) : (
          <div style={{ marginTop: 10 }}>
            <Avatar src={selectObj?.defaultAccount?.image} icon={<UserOutlined />} size={30} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>
              {selectObj?.defaultAccount?.name}（ID：
              {selectObj?.defaultAccount?.id}）
            </span>
          </div>
        )}
      </div>
      {showTable && (
        <Modal
          closable
          open={showTable}
          title={`选择${texts?.identity}`}
          width={600}
          footer={null}
          onCancel={() => setShowTable(false)}
        >
          <ProForm
            layout="inline"
            className={styles.mb20}
            onFinish={async (value?: any) => await getTableList(value)}
            onReset={() => {
              setRequestParams({
                pageNo: 1,
                pageSize: 5,
              });
            }}
          >
            <ProFormText
              name={texts?.paramText}
              label="昵称/电话"
              placeholder="请输入昵称/电话"
              width="sm"
            />
          </ProForm>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={tableList}
            pagination={{
              pageSize: requestParams?.pageSize,
              current: requestParams?.pageNo,
              total,
              onChange: (pageNo: number, pageSize: number) => {
                setRequestParams({ pageNo, pageSize });
              },
            }}
          />
        </Modal>
      )}
    </ModalForm>
  );
};

export default memo(OperateModel);

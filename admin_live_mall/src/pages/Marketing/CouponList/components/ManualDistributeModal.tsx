import { useEffect, useState } from 'react';
import { Alert, Button, Modal, Popover, Select, Tag, Tooltip, Image } from 'antd';

import { ProColumns, ProTable } from '@ant-design/pro-components';
import { getUserLabels, getUserLevel } from '../service';
import { ITotalCustomerTabCom } from '@/pages/Customer/TotalCustomer/data';
import { TableRequest } from '@/pages/utils/tableRequest';
import { getClients } from '@/pages/Customer/TotalCustomer/services';

interface IProps {
  showManualModal: boolean;
  setShowManualModal: (visible: boolean) => void;
}

const ManualDistributeModal = (props: IProps) => {
  const { showManualModal = false, setShowManualModal } = props;
  const [levelSource, setLevelSource] = useState<IOption[]>([]); // 会员等级
  const [labelOptions, setLabelOptions] = useState<IOption[]>([]); // 会员等级

  const [selectRowKeys, setSelectRowKeys] = useState<string[]>([]);

  const getUserLevelList = async (): Promise<void> => {
    try {
      const { data = [] } = await getUserLevel();
      const levelList = data.map(({ level, name }: { level: string; name: string }) => ({
        value: +level,
        label: name,
      }));
      setLevelSource(levelList);
    } catch (e) {
      console.error(e);
    }
  };

  const getLabelOptions = async () => {
    const result = await getUserLabels();
    setLabelOptions(
      result.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      })),
    );
  };

  useEffect(() => {
    getUserLevelList();
    getLabelOptions();
  }, []);

  const columns: ProColumns<ITotalCustomerTabCom>[] = [
    {
      title: '用户昵称',
      dataIndex: 'userName',
    },
    {
      title: '用户头像',
      dataIndex: 'headImage',
      valueType: 'avatar',
      search: false,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '用户等级',
      dataIndex: 'levelName',
      // valueType: 'select',
      renderFormItem: () => {
        return <Select placeholder="请输入" options={levelSource}></Select>;
      },
      search: {
        transform: (value) => ({
          level: value,
        }),
      },
    },
    {
      title: '标签',
      dataIndex: 'labelIds',
      hideInTable: true,
      renderFormItem: () => {
        return <Select placeholder="请输入" mode="multiple" options={labelOptions}></Select>;
      },
    },
    {
      title: '标签',
      ellipsis: true,
      search: false,
      width: 250,
      align: 'center',
      render: (_, record: ITotalCustomerTabCom) => {
        return (
          <Tooltip
            title={
              record?.labels?.length ? (
                <>
                  {record?.labels?.map(({ name, id }) => (
                    <Tag color="blue" key={id}>
                      {name}
                    </Tag>
                  ))}
                </>
              ) : null
            }
            color="#fff"
          >
            {record?.labels?.length
              ? record?.labels?.slice(0, 3).map(({ name, id }) => (
                  <Tag color="blue" key={id}>
                    {name}
                  </Tag>
                ))
              : '-'}
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Modal
      width={1000}
      title="手动发放优惠券"
      open={showManualModal}
      destroyOnClose
      onCancel={() => {
        setShowManualModal(false);
      }}
    >
      <Alert
        style={{ margin: '20px 0' }}
        type="warning"
        message={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>给指定客户发放优惠券，客户在领取时间内进入小程序可领取</span>
            <Popover
              placement="right"
              title=""
              content={
                <Image
                  style={{ width: 100, height: 220 }}
                  src={require('@/assets/couponPreview.png')}
                />
              }
              trigger="hover"
            >
              <Button type="link">预览效果</Button>
            </Popover>
          </div>
        }
      />
      <ProTable<ITotalCustomerTabCom>
        columns={columns}
        headerTitle="客户列表"
        // scroll={{ x: 1400 }}
        // search={false}
        rowKey="id"
        pagination={{
          pageSizeOptions: [10, 20, 50, 100],
          onChange: () => {
            setSelectRowKeys([]);
          },
          showSizeChanger: true,
        }}
        rowSelection={{
          selectedRowKeys: selectRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectRowKeys(selectedRowKeys as string[]);
          },
        }}
        request={(params: any) => TableRequest(params, getClients)}
      />
    </Modal>
  );
};

export default ManualDistributeModal;

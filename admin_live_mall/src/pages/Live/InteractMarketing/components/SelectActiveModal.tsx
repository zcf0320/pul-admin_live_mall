import { Modal } from 'antd';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { TableRequest } from '@/pages/utils/tableRequest';
import { getPage as pageLuckBag } from '@/pages/Marketing/LuckyBag/service';
import { TableListItem } from '@/pages/Marketing/LuckyBag/data';

interface IProps {
  onOk: (selectActive: TableListItem) => void;
  onCancel: () => void;
  open: boolean;
}

export default function SelectActiveModal(props: IProps) {
  const { open, onCancel, onOk } = props;

  const renderSelect = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          onOk(record);
        }}
      >
        投放
      </a>
    );
  };

  const columns: ProColumns<any>[] = [
    {
      title: '活动id',
      dataIndex: 'id',
    },
    {
      title: '活动名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      search: false,
      ellipsis: true,
      valueEnum: {
        true: '已绑定',
        false: '未绑定',
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160,
      search: false,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '操作',
      width: 80,
      tooltip: '将福袋关联直播间后，用户达到签到时长即弹出福袋弹窗，直播间只能用时投放一个福袋',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (node, record) => [renderSelect(record)],
    },
  ];

  return (
    <Modal footer={null} destroyOnClose width={'80%'} open={open} onCancel={onCancel}>
      <ProTable
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        columns={columns}
        rowKey={'id'}
        scroll={{ y: 300 }}
        form={{ span: 6, collapsed: false }}
        request={(params) => {
          return TableRequest(params, pageLuckBag);
        }}
      ></ProTable>
    </Modal>
  );
}

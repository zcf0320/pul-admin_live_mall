export const tabPaneList = [
  {
    key: 'ALL',
    label: '全部',
    type: 'all',
  },
  {
    key: 'WAIT_PAY',
    label: '待付款',
    color: 'blue',
    type: 'waitPay',
  },
  {
    key: 'TO_SHIP',
    label: '待发货',
    color: '#f0ad4e',
    type: 'toShip',
  },
  {
    key: 'TO_RECEIVE',
    label: '已发货',
    color: 'orangered',
    type: 'toReceive',
  },
  {
    key: 'FINISH',
    label: '已完成',
    color: 'green',
    type: 'finish',
  },
  {
    key: 'CLOSE',
    label: '已取消',
    color: 'rgba(204,200,200,0.75)',
    type: 'closeCount',
  },
  {
    key: 'AFTER_SALES',
    label: '售后中',
    color: 'red',
    type: 'afterSales',
  },
  {
    key: 'REFUND',
    label: '已退款',
    color: '#ae04f2',
    type: 'refund',
  },
];

export interface IRequestParams {
  pageSize: number;
  pageNo: number;
  status?: string;
  settleStatus?: boolean;
  settleStartTime?: string;
  settleEndTime?: string;
  startTime?: string;
  endTime?: string;
  teamInfo?: string;
}

export interface IPromoteOrderList {
  status: string;
  createTime: string;
  settleTime: string;
  orderNo: string;
  settleStatus: string;
  levelName: string;
  totalCommission: string;
  teamName: string;
  teamId: string;
  teamPhone: string;
}

export interface IOrderStatusNum {
  waitPay: number;
  toReceive: number;
  toShip: number;
  closeCount: number;
  refund: number;
  finish: number;
  afterSales: number;
  all: number;
}

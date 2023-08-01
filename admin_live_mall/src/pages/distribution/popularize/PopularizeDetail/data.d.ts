interface IPopularRequestParams {
  id?: string;
  settleFlag?: boolean | undefined;
  startTime?: string;
  endTime?: string;
  pageNo: number;
  pageSize: number;
}

interface IPopularizeInfo {
  image: string;
  orderTotal: string;
  phone: string;
  userId: string;
  level: string;
  createTime: string;
  customerCount: string;
  name: string;
  supName: string;
  settledOrder: string;
  toBeSettledOrder: string;
  totalAmount: string;
  settledAmount: string;
  toBeSettledAmount: string;
  tutorId: string;
  levelName: string;
  orgName: string;
}

interface ITableDataList {
  orderNo: string;
  settleFlag: boolean;
  settleTime: string;
  commissionRate: string;
  realCommission: string;
}

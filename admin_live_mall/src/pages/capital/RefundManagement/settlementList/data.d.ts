interface ISettlementRequestParams {
  pageNo: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
  orderNo?: string;
  serialNumber?: string;
  settleFlag?: boolean;
  entryTime?: string[];
}

interface ISettlementList {
  orderNo: string;
  serialNumber: string;
  createTime: string;
  settleFlag: boolean;
  settleType: string;
  settledAmount: number;
  settleTime: string;
  name: string;
  payPrice: number;
  estimatedCommission: number;
  realCommission: number;
  commissionRate: number;
}
interface ISettlementDetail {
  settledAmount: string;
  settledCount: number;
  toBeSettledAmount: string;
  toBeSettledCount: number;
}

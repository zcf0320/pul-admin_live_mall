interface IOption {
  value: string;
  label: string;
  status?: boolean;
}

interface IPartnerList {
  id: string;
  status: boolean;
  isDefault: boolean;
  image: string;
  name: string;
  phone: string;
  remarkName: string;
  createTime: string;
  settleTime: string;
  customerNum: number;
  level: number;
  levelName: string;
  toBeSettledCommission: string;
  settledCommission: string;
}

interface IPartnerRequestParams {
  pageNo: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
  level?: number;
  partnerInfo?: string;
  status?: boolean;
}

interface IOption {
  value: number;
  label: string;
  disabled?: boolean;
}

interface ITimeData {
  startTime: string;
  endTime: string;
}

type ITotalCustomerTabCom = {
  headImage?: string;
  userName: string;
  phone: string;
  level: number;
  registerTime: string;
  consumptionAmount: number;
  consumptionNum: number;
  teamHeadImage: string;
  teamName: string;
  teamPhone: string;
  teamLevelName: string;
  teamId: string;
  labels: any[];
  id: string;
  identity: string;
  status: boolean;
  isDefault: boolean;
  levelName: string;
  growthValue: number;
  teamOrgName?: string;
};

interface IOperateBtns {
  dynamicTitle?: boolean;
  operateTitle?: string;
  clickFc?: (record: ITotalCustomerTabCom) => void | Promise<void>;
  type?: string;
}

interface IPageParams {
  pageSize?: number;
  pageNo: number;
  // current: number;
}

interface IQueryParams {
  startTime: string;
  endTime: string;
  labelIds: string[];
  level: number;
  phone: string;
  timeType: number;
  userName: string;
  identity: number;
  timeData?: string[];
}

export { ITotalCustomerTabCom, IOperateBtns, IPageParams, IQueryParams, IOption, ITimeData };

interface IEquityList {
  icon: string;
  id: string | number;
  name: string;
  status: boolean;
}

// 会员列表
interface ILevelSource {
  backImage: string;
  id: string;
  level: number;
  name: string;
  peakValue: number;
  status: boolean;
  rightsList?: IEquityList[];
}

// 权益列表

// 等级抽屉表单参数
interface ILevelForm {
  id?: string | number;
  name: string;
  peakValue?: number;
  rightsIds?: number[];
  backImage?: string;
  rightsList?: string | number[];
}

// 当前等级一些状态参数
interface IcurrentLevelStatusParams {
  isEdit: boolean; // 是否为编辑状态
  isAddOrEditFirstLevel: boolean; // 当前为新增或者编辑VIP1状态时
  peakValueTip: string; // 成长值文本提示
  defaultValue: string | number;
  minPeakValue?: number;
  maxPeakValue?: number;
}

interface IgrowthValues {
  addNum: { minPeakValue: number };
  editNum: { minPeakValue: number; maxPeakValue: number };
}

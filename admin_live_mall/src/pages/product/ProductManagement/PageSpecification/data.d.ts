export type TableListItem = {
  id: number;
  name: string;
  remark: string;
  specValues: SpecValue[];
};
export type SpecValue = {
  id: number;
  specId: number;
  value: string;
};

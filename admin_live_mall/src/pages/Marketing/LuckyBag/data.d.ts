export interface TableListItem {
  condition: 'DIRECT_GET' | 'SIGN'; //参与条件,可用值:DIRECT_GET,SIGN	string
  createTime: string; //	创建时间	string
  giftCount: number; //	奖品数量	integer
  goods: string; //	中奖商品	array	integer
  id: number; //		integer
  method: string; //	履约方式	string
  name: string; //	活动名称	string
  probability: number; //	中奖概率	number
  shopId: number; //	integer
  singleTime: number; //	单次观看时长	integer
  totalTime: number; //	累计时长	integer
  type: string; //	活动类型,可用值:FUDAI,SIGN	string
  unit: string; //	时间单位	string
  status: string;
}

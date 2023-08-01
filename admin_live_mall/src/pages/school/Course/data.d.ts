export type TableListItem = {
  courseDetail: string; //课程详情	string
  courseSubtitle: string; //课程副标题	string
  courseTitle: string; //课程标题	string
  createId: number; //创建人id	integer(int64)
  createTime: string; //创建时间	string(date-time)
  giftBag: string; //邮寄礼包清单	string
  id: number; //id	integer(int64)
  isDelete: boolean; //逻辑删除	boolean
  learnCount: number; //已学人数（基础值）	integer(int32)
  mainImage: string; //课程主图	string
  modifyId: number; //修改人id	integer(int64)
  modifyTime: string; //修改时间	string(date-time)
  packageTitles: []; //套餐名称		array	string
  status: number; //课程状态：0-下架 1-上架	integer(int32)
  tuitionFee: number; //学费	number
  rating: string; //评分
  types: []; //课程类型：1-线上课 2-线下课 3-内训课		array	integer
  name: string; // 讲师名称
};

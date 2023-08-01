export type TableListItem = {
  courseId: number; //	课程id	integer(int64)
  createId: number; //	创建人id	integer(int64)
  createTime: string; //	创建时间	string(date-time)
  id: number; //	id	integer(int64)
  isDelete: boolean; //	逻辑删除	boolean
  modifyId: number; //	修改人id	integer(int64)
  modifyTime: string; //	修改时间	string(date-time)
  sort: number; //	排序，越大越靠前	integer(int32)
  sourceType: number; //	资源类型：1-音频 2-视频	integer(int32)
  sourceUrl: string; //	资源链接地址	string
  subsectionTitle: string; //	小节标题	string
  courseTime: number; //courseTime	课程时长，单位秒	integer(int32)
};

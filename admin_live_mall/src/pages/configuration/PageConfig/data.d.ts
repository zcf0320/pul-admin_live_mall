export interface TableListItem {
  createId: number; //createId	创建人id	integer(int64)
  createTime: string; //createTime	创建时间	string(date-time)
  id: number; //id	id	integer(int64)
  isDelete: boolean; //isDelete	逻辑删除	boolean
  jumpParams: string; //jumpParams	跳转参数	string
  jumpType: number; //jumpType	跳转类型：1-本地 2-h5	integer(int32)
  jumpUrl: string; //jumpUrl	跳转路径	string
  modifyId: number; //modifyId	修改人id	integer(int64)
  modifyTime: string; //modifyTime	修改时间	string(date-time)
  orgCode: string; //orgCode	公司/机构编码	string
  picItem: string; //picItem	图片	string
  sort: number; //sort	权重	integer(int32)
  type: string; //type	类型	string
  typeName: string; //typeName	类型名称	string
}

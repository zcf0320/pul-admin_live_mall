export interface TableListItem {
  cover: string; //	封面图	string
  createTime: string; //	创建时间	string
  enableComment: boolean; //	开启评论	boolean
  enableKf: boolean; //	开启客服	boolean
  enableLike: boolean; //	是否开启点赞	boolean
  enableReplay: boolean; //	开启回放	boolean
  enableShare: boolean; //	开启分享	boolean
  endTime: string; //	结束时间	string
  id: number; //		integer
  liveStatus: string; //	直播状态	string
  name: string; //	直播间名称	string
  playerAccount: string; //	主播手机号	string
  playerNickname: string; //	主播昵称	string
  pullStream: string; //	拉流地址	string
  pushStream: string; //	推流地址	string
  shopId: number; //		integer
  startTime: string; //	开始时间	string
  type: 'MOBILE' | 'DEVICE'; //	直播类型,可用值:MOBILE,DEVICE	string
}

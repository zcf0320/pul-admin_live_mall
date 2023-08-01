// @ts-ignore
/* eslint-disable */

declare namespace API {
  // type CurrentUser = {
  //   name?: string;
  //   avatar?: string;
  //   userid?: string;
  //   email?: string;
  //   signature?: string;
  //   title?: string;
  //   group?: string;
  //   tags?: { key?: string; label?: string }[];
  //   notifyCount?: number;
  //   unreadCount?: number;
  //   country?: string;
  //   access?: string;
  //   geographic?: {
  //     province?: { label?: string; key?: string };
  //     city?: { label?: string; key?: string };
  //   };
  //   address?: string;
  //   phone?: string;
  // };
  type CurrentUser = {
    id: number;
    createId: number;
    createTime: string;
    modifyId: number;
    modifyTime: string;
    isDelete: boolean;
    orgCode: string;
    userName: string;
    password: string;
    realName: string;
    headImage: null;
    lastLoginTime: number;
    lastLoginIp: null;
    status: number;
    roles: string;
    roleNames: string;
    orgName: string;
    mobile: number;
  };

  type Response<T = any> = {
    requestNo: string;
    message: string;
    code: number;
    data: T;
  };

  type Page<T = any> = {
    current: number; /// 当前页
    hitCount?: boolean;
    pages?: number;
    records: T; /// 当前页数据
    searchCount?: boolean;
    size?: number;
    total: number; /// 总数
  };

  type ResponsePage<T = any> = {
    code: number; //	状态码	integer(int32)	integer(int32)
    data: {
      current: number; //		integer(int64)
      hitCount: boolean; //		boolean
      pages: number; //		integer(int64)
      records: T[]; //		array	QualificationVO
      searchCount: boolean; //		boolean
      size: number; //		integer(int64)
      total: number; //		integer(int64)
    }; //	结果集	CosCredentialVo	CosCredentialVo
    message: string; //	状态文本	string
    requestNo: string; //	请求流水号	string
  };

  type ISystemIndexResponse = {
    backUser: CurrentUser;
    menuTree: IMenuTree[];
  };

  type IMenuTree = {
    menuName: string;
    menuIcon: string;
    menuUrl: string;
    authority: string;
    menuType: number;
    hidden?: boolean;
    layout?: boolean;
    subMenus: IMenuTree[];
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}

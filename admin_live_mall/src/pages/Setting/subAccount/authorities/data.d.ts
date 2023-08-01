export interface IAuthoritiesListItem {
  authority: string;
  authorityName: string;
  checked: number;
  id: number;
  menuIcon: string;
  menuType: number;
  menuUrl: string;
  parentId: number;
  sort: number;
  menuName: string;
  subMenus: IAuthoritiesListItem[];
}
export interface IAddAuthoritiesParams {
  authority?: string; /// 授权标识
  authorityName?: string; /// 权限名称
  createId?: number; /// 创建人id
  createTime?: string; /// 创建时间
  id?: number;
  isDelete?: boolean; /// 逻辑删除
  menuIcon?: string; /// 菜单图标
  menuType?: number; /// 0菜单，1按钮
  menuUrl?: string; /// 菜单url
  modifyId?: number; /// 修改人id
  modifyTime?: string; /// 修改时间
  orgCode?: string; /// 公司/机构编码
  parentId?: number; /// 父id
  sort?: number; /// 排序号
}
export interface IOrgListRespones {
  address: string;
  createId: number;
  createTime: string;
  description: string;
  id: number;
  isDelete: boolean;
  linkMan: string;
  modifyId: number;
  modifyTime: string;
  orgCode: string;
  orgName: string; /// 公司/机构名称
  phone: string;
  remark: string;
  status: string;
}

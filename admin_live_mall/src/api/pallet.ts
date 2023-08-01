import { request } from '@umijs/max';
import axios from 'axios';
import shareRequest from './shareRequest';
import {
  IAccessRecords,
  ICategory,
  ICompanyInfoType,
  IPallet,
  IPalletProduct,
  IPalletShareRecord,
  ISharePallet,
  IViews,
} from './type';

export const postRemoveProductFromPallet = (data: {
  palletId: string;
  relationIdList: string[];
}) => {
  return request<API.ResponsePage<string>>('/api/pallet/removeGoodsFromPallet', {
    method: 'POST',
    data,
  });
};

export const getProductInPallet = (data: {
  palletId: string;
  pageNo: number;
  pageSize: number;
}) => {
  return request<API.ResponsePage<IPalletProduct>>('/api/pallet/palletGoods', {
    method: 'GET',
    params: data,
  });
};

export const postUpdatePriceBatch = (data: {
  goodsId: string[]; //	货盘商品ID		false	array integer
  palletId: string; //	货盘ID		false	integer(int64)
  type: 'price' | 'percent'; //	修改类型 price=金额 percent=比例		false	string
  value: string; //	修改的值		false	string
}) => {
  return request<API.Response<string>>('/api/pallet/updatePriceBatch', {
    method: 'POST',
    data,
  });
};
export const postUpdatePriceBatchNew = (data: {
  goodsId: string[]; //	货盘商品ID		false	array integer
  palletId: string; //	货盘ID		false	integer(int64)
  type: 'price' | 'percent'; //	修改类型 price=金额 percent=比例		false	string
  priceType:
    | 'publicPrice'
    | 'groupPrice'
    | 'bmColonelPrice'
    | 'colonelPrice'
    | 'coreColonelPrice'
    | 'proxyPrice'; //	价格类型,可用值:publicPrice,groupPrice,bmColonelPrice,colonelPrice,coreColonelPrice,proxyPrice
  value: string; //	修改的值		false	string
}) => {
  return request<API.Response<string>>('/api/mjh/updatePriceBatch', {
    method: 'POST',
    data,
  });
};

export const postUpdateSupplyPriceBatch = (data: {
  goodsId: string[]; //	货盘商品ID		false	array integer
  palletId: string; //	货盘ID		false	integer(int64)
  type: 'price' | 'percent'; //	修改类型 price=金额 percent=比例		false	string
  value: string; //	修改的值		false	string
}) => {
  return request<API.Response<string>>('/api/pallet/updateSupplyPriceBatch', {
    method: 'POST',
    data,
  });
};

export const postDeletePallet = (data: { id: string }) => {
  return request<API.Response<null>>('/api/pallet/deletePallet', {
    method: 'POST',
    data,
  });
};

export const postUpOrDownPallet = (data: { id: string; status: boolean }) => {
  return request<API.Response<string>>('/api/pallet/onOffPallet', {
    method: 'POST',
    data,
  });
};

export const postShareQrCode = (data: {
  endTime?: string; //	结束时间 自定义必填		false	string(date-time)
  palletId: string; //	货盘ID		false	integer(int64)
  password: string; //	密码		false	string
  startTime?: string; //	开始时间 自定义必填		false	string(date-time)
  timeType: string; //	时效类型,可用值:FOREVER,WEEK,MONTH,CUSTOM		false  string;
}) => {
  return request<API.Response<IPalletShareRecord & { url: string }>>('/api/pallet/shareQrCode', {
    method: 'POST',
    data,
  });
};

export const postExportPallet = (data: { id: string }) => {
  return request<Blob>('/api/pallet/exportPallet', {
    method: 'GET',
    params: data,
    responseType: 'blob',
    errorHandler: () => null,
    skipErrorHandler: true,
  });
};

export const getPalletList = (data: {
  pageSize: number;
  name?: string;
  pageNo: number;
  status?: boolean;
}) => {
  return request<API.ResponsePage<IPallet>>('/api/pallet/pallets', {
    method: 'GET',
    params: data,
  });
};

export const postEditPallet = (data: { name: string; remake: string; id: number }) => {
  return request<API.Response<string>>('/api/pallet/updatePallet', {
    method: 'POST',
    data,
  });
};

export const postAddPallet = (data: {
  goodsIds: number[];
  name: string;
  remake: string;
  source: 'excel' | 'product' | 'pallet';
}) => {
  return request<API.Response<string>>('/api/pallet/addPallet', {
    method: 'POST',
    data,
  });
};

export const postUploadExcel = (data: FormData) => {
  return request<API.Response<string>>('/api/mjh/importExcel', {
    method: 'POST',
    data,
  });
};

export const postCopyPallet = (data: { id: string; name: string; remark?: string }) => {
  return request<API.ResponsePage<IPallet>>('/api/pallet/copyPallet', {
    method: 'POST',
    data,
  });
};

export const getPalletProductList = (data: {
  pageSize: number;
  pageNo: number;
  filter?: boolean;
  palletId?: string;
}) => {
  return request<API.ResponsePage<IPalletProduct>>('/api/pallet/goods', {
    method: 'GET',
    params: data,
  });
};

export const getProductList = (data: {
  pageSize: number;
  pageNo: number;
  filter?: boolean;
  palletId?: string;
}) => {
  return request<API.ResponsePage<IPalletProduct>>('/api/pallet/goods', {
    method: 'GET',
    params: data,
  });
};
export const getNewProductList = (data: {
  pageSize: number;
  pageNo: number;
  filter?: boolean;
  palletId?: string;
}) => {
  return request<API.ResponsePage<IPalletProduct>>('/api/mjh/goods', {
    method: 'GET',
    params: data,
  });
};
export const getNewPalletGoodsList = (data: {
  pageSize: number;
  pageNo: number;
  filter?: boolean;
  palletId?: string;
}) => {
  return request<API.ResponsePage<IPalletProduct>>('/api/mjh/palletGoods', {
    method: 'GET',
    params: data,
  });
};
export const postDeleteProduct = (data: { id: string }) => {
  return request<API.Response<null>>('/api/pallet/deleteGoods', {
    method: 'GET',
    params: data,
  });
};

export const postUpOrDownProduct = (data: { id: string; status: 0 | 1 }) => {
  return request<API.Response<string>>('/api/pallet/onOffGoods', {
    method: 'POST',
    data,
  });
};

export const postAddProductToPallet = (data: { palletId: string; goodsIdList: string[] }) => {
  return request<API.ResponsePage<IPallet>>('/api/pallet/addGoodsToPallet', {
    method: 'POST',
    data,
  });
};

// export const getProductDetail = (data: { id: string }) => {
//   return request<API.Response<IPalletProduct>>('/api/pallet/getGoods', {
//     method: 'GET',
//     params: data,
//   });
// };
export const getProductDetail = (data: { id: string }) => {
  return request<API.Response<IPalletProduct>>('/api/mjh/goodsDetail', {
    method: 'GET',
    params: data,
  });
};

export const getCategoryList = (data: { parentId: number }) => {
  return request<API.Response<ICategory[]>>('/api/productInfo/categoryList', {
    method: 'POST',
    data: data,
  });
};

export const addProduct = (data: any) => {
  return request('/api/pallet/addGoods', {
    method: 'POST',
    data,
  });
};

export const addPalletProduct = (data: any) => {
  return request('/api/pallet/addGoodsToPallet', {
    method: 'POST',
    data,
  });
};

// export const editProduct = (data: any) => {
//   return request('/api/pallet/updateGoods', {
//     method: 'POST',
//     data,
//   });
// };
export const editProduct = (data: any) => {
  return request('/api/mjh/updateGoods', {
    method: 'POST',
    data,
  });
};

export const editPalletProduct = (data: any) => {
  return request('/api/mjh/updatePalletGoods', {
    method: 'POST',
    data,
  });
};

export const getShareHistory = (data: { pageSize: number; id?: string; pageNo: number }) => {
  return request<API.ResponsePage<IPalletShareRecord>>('/api/getShareHistory', {
    method: 'GET',
    params: data,
  });
};

export const postExpireShare = (data: { id: string }) => {
  return request<API.Response<string>>('/api/expireShare', { method: 'GET', params: data });
};

export const getViewShareHistory = (data: { pageSize: number; id?: string; pageNo: number }) => {
  return request<API.ResponsePage<IViews>>('/api/getViewShareHistory', {
    method: 'GET',
    params: data,
  });
};

export const getProductDetailInPallet = (data: { id: string }) => {
  return request<API.Response<IPalletProduct>>('/api/mjh/palletGoodsDetail', {
    method: 'GET',
    params: data,
  });
};

export const postSharePallet = (data: {
  password?: string; //	货盘商品ID		false	array integer
  shareCode: string; //	货盘ID		false	integer(int64)
}) => {
  return axios.post<API.Response<ISharePallet>>('/api/mjh/getSharePallet', data, {
    headers: { token: localStorage.getItem('shareToken') ?? 'null' },
  });
};
export const postShareAccessRecord = (data: { pageNo: number; pageSize: number }) => {
  return shareRequest.get<API.ResponsePage<IAccessRecords>>('/api/pallet/accessRecord', {
    params: data,
    // headers: { token: localStorage.getItem('shareToken') ?? 'null' },
  });
};
export const getMyPalletFavorite = (data: { pageNo: number; pageSize: number }) => {
  return shareRequest.get<API.ResponsePage<any>>('/api/pallet/myPalletFav', {
    params: data,
    // headers: { token: localStorage.getItem('shareToken') ?? 'null' },
  });
};
export const postFavorite = (data: { shareCode: string }) => {
  return shareRequest.post<API.ResponsePage<IAccessRecords>>('/api/pallet/favorites', data);
};
export const postUnFavorite = (data: { shareCode: string }) => {
  return shareRequest.post<API.ResponsePage<IAccessRecords>>('/api/pallet/deletePalletFav', data);
};

export const shareLogin = (data: { code: string; mobile: string }) => {
  return request<API.Response<string>>('/api/toViewShare', {
    method: 'POST',
    data,
  });
};

export const getCompanyInfo = () => {
  return request<API.Response<ICompanyInfoType>>('/api/system/companyInfo', {
    method: 'GET',
  });
};
export const postCompanyInfo = (data: ICompanyInfoType) => {
  return request<API.Response<string>>('/api/system/companyInfo', {
    method: 'POST',
    data,
  });
};
export const postCustomerInfo = (data: Partial<ICompanyInfoType>) => {
  return request<API.Response<string>>('/api/system/setContact', {
    method: 'POST',
    data,
  });
};

export const catSharePallet = (data: any) => {
  return request<API.Response<any>>('/api/catSharePallet', {
    method: 'GET',
    params: data,
  });
};

export const registerChannel = (data: ICompanyInfoType) => {
  return request<API.Response<string>>('/api/registerChannel', {
    method: 'POST',
    data,
  });
};

export const getShareInfo = (data: { id: string }) => {
  return request<API.Response<any>>('/api/getShareInfo', {
    method: 'GET',
    params: data,
  });
};

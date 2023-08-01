import { request } from '@umijs/max';
import { IProduct, IProductDetail } from './type';

export const getProductList = (data: { pageSize: number; pageNo: number }) => {
  return request<API.ResponsePage<IProduct>>('/v1/product/page', {
    method: 'POST',
    data: data,
  });
};

export const postDeleteProduct = (data: { id: string }) => {
  return request<API.Response<null>>('/v1/product/delete', {
    method: 'POST',
    data: data,
  });
};

export const postUpOrDownProduct = (data: { id: string; status: 0 | 1 }) => {
  return request<API.Response<string>>('/v1/product/updateStatus', {
    method: 'POST',
    data,
  });
};

export const getProductDetail = (data: { id: string }) => {
  return request<API.Response<IProductDetail>>('/v1/product/detail', {
    method: 'POST',
    data: data,
  });
};

export const editProduct = (data: any) => {
  return request('/v1/product/edit', {
    method: 'POST',
    data,
  });
};

export const addProduct = (data: any) => {
  return request('/v1/product/add', {
    method: 'POST',
    data,
  });
};
export const getProductsByIds = (data: any) => {
  return request<API.ResponsePage<IProduct>>('/v1/product/getProductsBatch', {
    method: 'POST',
    data,
  });
};

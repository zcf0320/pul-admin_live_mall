import { ShopInfo, UserInfo } from '@/pages/store/storeSettings/StoreInfo/data';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './index';
import { getShopInfo } from '@/pages/store/storeSettings/StoreInfo/service';
import { changeFavoriteIcon } from '@/pages/utils';

const initialState: {
  storeInfo: ShopInfo | null;
  userInfo: UserInfo | null;
} = {
  storeInfo: null,
  userInfo: null,
};

export const selectStoreInfo = (state: RootState) => state.storeInfo;
export const selectStoreLogo = (state: RootState) => state.storeInfo?.logo;
export const selectStoreName = (state: RootState) => state.storeInfo?.name;

export const selectUserHeaderImage = (state: RootState) => state.userInfo?.headImage || '';

export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setShopInfo: (state, action) => {
      state.storeInfo = action.payload;
      changeFavoriteIcon(action.payload.logo);
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

const { setShopInfo, setUserInfo } = storeSlice.actions;

export const refreshStoreInfo = () => (dispatch: AppDispatch) => {
  getShopInfo().then((res) => {
    dispatch(setShopInfo(res.data));
  });
};

export const refreshUserInfo = (state: any) => (dispatch: AppDispatch) => {
  dispatch(setUserInfo(state));
};

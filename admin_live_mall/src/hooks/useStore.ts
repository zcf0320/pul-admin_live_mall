import {
  refreshStoreInfo,
  refreshUserInfo,
  selectStoreInfo,
  selectStoreLogo,
  selectStoreName,
  selectUserHeaderImage,
} from '@/store/store';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './hooks';

export default function useStore() {
  const dispatch = useAppDispatch();
  const storeInfo = useSelector(selectStoreInfo);
  const storeName = useSelector(selectStoreName);
  const storeLogo = useSelector(selectStoreLogo);
  const userHeaderImage = useSelector(selectUserHeaderImage);

  const refreshStore = useCallback(() => {
    dispatch(refreshStoreInfo());
  }, [dispatch]);

  const refreshUser = useCallback(
    (state: any) => {
      dispatch(refreshUserInfo(state));
    },
    [dispatch],
  );

  return {
    storeInfo,
    storeName,
    storeLogo,
    userHeaderImage,
    refreshStore,
    refreshUser,
  };
}

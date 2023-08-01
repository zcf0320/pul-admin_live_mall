import useStore from '@/hooks/useStore';
import { store } from '@/store';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

export default (props: { children: any }) => {
  // 店铺信息
  const storeInfo = useStore();
  useEffect(() => {
    storeInfo.refreshStore();
  }, []);

  return <Provider store={store}>{props.children}</Provider>;
};

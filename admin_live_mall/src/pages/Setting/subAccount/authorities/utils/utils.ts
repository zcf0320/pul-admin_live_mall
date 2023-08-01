export const TableArrRequest = async (params: any, request: any) => {
  const msg = await request(params);
  return {
    data: msg?.data?.map((item: any, index: number) => ({
      ...item,
      key: index,
    })),
  };
};
export const TreeTableArrRequest = async (params: any, request: any) => {
  const msg = await request(params);
  const factMenus = (Menu: any): any =>
    Menu?.map((item: any) =>
      item?.subMenus?.length > 0
        ? {
            ...item,
            key: item.id,
            children: factMenus(item.subMenus),
          }
        : {
            ...item,
            key: item.id,
          },
    );
  return {
    data: factMenus(msg?.data),
  };
};

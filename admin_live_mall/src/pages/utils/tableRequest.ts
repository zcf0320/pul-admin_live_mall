export const TableRequest = async (params: any, request: any) => {
  const res = await request(params);
  return {
    data: res?.data?.records?.map((item: any) => ({
      ...item,
    })),
    total: res?.data?.total,
  };
};

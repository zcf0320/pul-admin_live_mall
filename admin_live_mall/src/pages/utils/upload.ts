export const uploadSet = (fileList: any[]) => {
  const images = fileList
    .filter((file) => file.status === 'done')
    .map((file) => {
      const location: string = (file.response as any).Location;
      return location.includes('http') ? location : 'http://' + location;
    })
    .join(',');
  return images;
};

export const uploadGet = (urls: string | undefined) => {
  console.log('urls', urls);
  if (!urls) return undefined;
  if (urls.length === 0) return undefined;
  return urls.split(',').map((item, index) => {
    return {
      uid: String(index + 1),
      url: item,
      name: item,
      status: 'done',
      response: { Location: item },
    };
  });
};

export const runningOnMobile = () => {
  const toMatch = [
      'Android',
      'webOS',
      'iPhone',
      'ipad',
      'iPod',
      'BlackBerry',
      'Windows Phone'
  ];

  return toMatch.some((toMatchItem) => {
      return navigator.userAgent.includes(toMatchItem);
  });
};

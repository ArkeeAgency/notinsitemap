export const extractDomainFromUrl = (url: string): string => {
  const urlObject = new URL(url);
  return urlObject.hostname;
};

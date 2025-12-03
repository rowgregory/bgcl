export const isValidUrl = (url: string): boolean => {
  if (!url || !url.trim()) {
    return false;
  }

  try {
    const urlObject = new URL(url);
    return urlObject.protocol === "http:" || urlObject.protocol === "https:";
  } catch {
    return false;
  }
};

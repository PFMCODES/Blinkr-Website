function isValidUrl(input) {
  if (!input || typeof input !== 'string') return false;

  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export { isValidUrl };
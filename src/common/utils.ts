export function generateID() {
  return Math.random().toString(36).slice(2);
}

export function camelToUnderline(key: string): string {
  if (typeof key !== 'string') {
    return key;
  }
  return key.replace(/([a-z])([A-Z])/g, (substring, $1, $2) => {
    return `${$1}_${$2.toLowerCase()}`;
  });
}

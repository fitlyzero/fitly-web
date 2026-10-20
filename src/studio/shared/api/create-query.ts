export const createQuery = (params: Record<string, string>): string =>
  new URLSearchParams(params).toString();

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const generateCode = (): string => {
  const year = new Date().getFullYear();
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return `RNS-${year}-${random}`;
};

export const generateBatch = (count: number): string[] => {
  const codes = new Set<string>();
  while (codes.size < count) {
    codes.add(generateCode());
  }
  return Array.from(codes);
};

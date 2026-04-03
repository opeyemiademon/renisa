const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const generateCode = () => {
    const year = new Date().getFullYear();
    let random = '';
    for (let i = 0; i < 6; i++) {
        random += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return `RNS-${year}-${random}`;
};
export const generateBatch = (count) => {
    const codes = new Set();
    while (codes.size < count) {
        codes.add(generateCode());
    }
    return Array.from(codes);
};
//# sourceMappingURL=memberCodeGenerator.js.map
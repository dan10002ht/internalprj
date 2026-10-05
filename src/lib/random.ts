export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Hoán vị index 0..n-1, đảm bảo khác thứ tự gốc khi n > 1 */
export function shuffledIndexes(n: number): number[] {
  const base = Array.from({ length: n }, (_, i) => i);
  if (n < 2) return base;
  let out = shuffle(base);
  while (out.every((v, i) => v === i)) out = shuffle(base);
  return out;
}

/** Xáo chữ cái của từ, đảm bảo khác từ gốc */
export function scrambleWord(word: string): string {
  const letters = word.toUpperCase().split('');
  let out = shuffle(letters).join('');
  for (let i = 0; i < 10 && out === word.toUpperCase(); i++) out = shuffle(letters).join('');
  return out;
}

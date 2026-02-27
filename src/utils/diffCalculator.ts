export interface DiffPart {
  type: 'unchanged' | 'added' | 'removed';
  value: string;
}

export const computeTextDiff = (before: string, after: string): DiffPart[] => {
  if (before === after) return [{ type: 'unchanged', value: before }];
  if (!before) return [{ type: 'added', value: after }];
  if (!after) return [{ type: 'removed', value: before }];

  // Simple word-level diff
  const beforeWords = before.split(/\s+/);
  const afterWords = after.split(/\s+/);

  const parts: DiffPart[] = [];

  // LCS-based simple diff
  const dp: number[][] = Array(beforeWords.length + 1)
    .fill(null)
    .map(() => Array(afterWords.length + 1).fill(0));

  for (let i = 1; i <= beforeWords.length; i++) {
    for (let j = 1; j <= afterWords.length; j++) {
      if (beforeWords[i - 1] === afterWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffPart[] = [];
  let i = beforeWords.length, j = afterWords.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && beforeWords[i - 1] === afterWords[j - 1]) {
      result.unshift({ type: 'unchanged', value: beforeWords[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', value: afterWords[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'removed', value: beforeWords[i - 1] });
      i--;
    }
  }

  // Merge consecutive same-type parts
  const merged: DiffPart[] = [];
  for (const part of result) {
    if (merged.length > 0 && merged[merged.length - 1].type === part.type) {
      merged[merged.length - 1].value += ' ' + part.value;
    } else {
      merged.push({ ...part });
    }
  }

  return merged.length > 0 ? merged : parts;
};

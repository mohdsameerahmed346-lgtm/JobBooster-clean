export function isPremium() {
  return localStorage.getItem("premium") === "true";
}

// Lifetime usage (no reset)
export function getUsage(key) {
  return Number(localStorage.getItem(key)) || 0;
}

export function increaseUsage(key) {
  const current = getUsage(key);
  localStorage.setItem(key, current + 1);
}

// Analyze: only 3 times ever
export function canUseAnalyze() {
  const usage = getUsage("analyze");
  return usage < 3;
  }

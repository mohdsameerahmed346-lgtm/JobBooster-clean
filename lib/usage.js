export function isPremium() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("premium") === "true";
}

export function getUsage(key) {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(key)) || 0;
}

export function increaseUsage(key) {
  if (typeof window === "undefined") return;
  const current = getUsage(key);
  localStorage.setItem(key, current + 1);
}

export function canUseAnalyze() {
  return getUsage("analyze") < 3;
}

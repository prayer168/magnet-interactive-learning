// 用 localStorage 記錄學習進度。
const KEY = "magnet-interactive-learning:progress";

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveProgress(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("[progress] 無法寫入 localStorage", e);
  }
}

export function initProgress() {
  const progress = loadProgress();
  // 進入過的頁籤標記為已讀。
  document.addEventListener("tab:change", (e) => {
    progress[e.detail.id] = true;
    saveProgress(progress);
  });
}

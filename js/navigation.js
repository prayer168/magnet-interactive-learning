// 頁籤切換。
export function initNavigation() {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  function activate(id) {
    tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.tab === id));
    panels.forEach((p) => p.classList.toggle("is-active", p.id === id));
    document.dispatchEvent(new CustomEvent("tab:change", { detail: { id } }));
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab.dataset.tab));
  });
}

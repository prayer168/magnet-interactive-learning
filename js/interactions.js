// 互動實驗、動畫模擬、生活應用卡片與自學資源的互動邏輯。

export function initInteractions() {
  // 3. 互動實驗：滑桿即時驅動 SVG。
  const slider = document.getElementById("demo-slider");
  const bar = document.getElementById("demo-bar");
  const level = document.getElementById("demo-level");
  const readout = document.getElementById("demo-readout");
  if (slider && bar && level && readout) {
    const update = () => {
      const v = Number(slider.value);
      const h = 10 + v * 0.7;          // 條高隨數值變化
      bar.setAttribute("y", 90 - h);
      bar.setAttribute("height", h);
      const y = 90 - h;                // 水位線跟著條頂
      level.setAttribute("y1", y);
      level.setAttribute("y2", y);
      readout.textContent = v;
    };
    slider.addEventListener("input", update);
    update();
  }

  // 4. 動畫模擬：分階段切換，不讓所有元素同時動。
  const scene = document.getElementById("sim-scene");
  const play = document.getElementById("sim-play");
  const caption = document.getElementById("sim-caption");
  if (scene && play && caption) {
    const stages = ["階段 1：起始狀態", "階段 2：板塊互相推擠", "階段 3：地表被抬升"];
    play.addEventListener("click", () => {
      const next = (Number(scene.dataset.stage) + 1) % stages.length;
      scene.dataset.stage = String(next);
      caption.textContent = stages[next];
    });
  }
}

// 5. 生活應用：渲染 6～8 則可互動卡片。
export function renderApply(content) {
  const root = document.getElementById("apply-root");
  const cases = content && content.sections && content.sections.apply
    ? content.sections.apply.cases : null;
  if (!root || !Array.isArray(cases) || cases.length === 0) {
    if (root) root.innerHTML = "<p>生活應用尚未建立，請於 data/content.json 加入 6～8 則情境。</p>";
    return;
  }
  root.innerHTML = "";
  cases.forEach((c) => {
    const card = document.createElement("article");
    card.className = "apply-card";
    card.innerHTML = `
      ${c.svg || ""}
      <h3>${c.title || ""}</h3>
      <p>${c.caption || ""}</p>
      <button class="btn" type="button">${c.action || "看看會怎樣"}</button>
      ${c.source ? `<p class="credit">來源：${c.source}</p>` : ""}`;
    const btn = card.querySelector("button");
    btn.addEventListener("click", () => card.classList.toggle("is-on"));
    root.appendChild(card);
  });
}

// 7. 自學資源：渲染影音教材與延伸連結，務必顯示來源。
export function renderResources(data) {
  const mediaRoot = document.getElementById("media-root");
  const linkRoot = document.getElementById("resources-root");

  if (mediaRoot) {
    const media = Array.isArray(data.media) ? data.media : [];
    mediaRoot.innerHTML = media.length
      ? media.map((m) => `
          <article class="media-card">
            <h3>${m.title || ""}</h3>
            <p>${m.type || "影音"}・適用 ${m.grade || ""}</p>
            <a href="${m.url}" target="_blank" rel="noopener">開啟資源</a>
            <p class="credit">來源：${m.source || "（待補）"}・檢核 ${m.checkedDate || ""}</p>
          </article>`).join("")
      : "<p>影音教材尚未建立，請於 data/resources.json 的 media 加入。</p>";
  }

  if (linkRoot) {
    const links = Array.isArray(data.resources) ? data.resources : [];
    linkRoot.innerHTML = links.length
      ? "<ul>" + links.map((r) => `
          <li><a href="${r.url}" target="_blank" rel="noopener">${r.name}</a>
          <span class="credit">（${r.type || ""}・檢核 ${r.checkedDate || ""}）</span></li>`).join("") + "</ul>"
      : "<p>延伸資源尚未建立。</p>";
  }
}

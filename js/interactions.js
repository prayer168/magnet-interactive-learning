// 互動實驗、動畫模擬、生活應用卡片與自學資源的互動邏輯。

export function initInteractions() {
  // 3. 互動實驗：滑桿控制磁鐵與迴紋針的距離，即時反映吸力強弱。
  const slider = document.getElementById("demo-slider");
  const clip = document.getElementById("demo-clip");
  const force = document.getElementById("demo-force");
  const readout = document.getElementById("demo-readout");
  const strength = document.getElementById("demo-strength");
  if (slider && clip && force && readout && strength) {
    const update = () => {
      const v = Number(slider.value);          // 0=最近、100=最遠
      // 迴紋針位置：近時靠向磁鐵（被吸過去），遠時在右側
      const baseX = 58;                         // 磁鐵右緣附近
      const farX = 150;
      const clipX = baseX + (farX - baseX) * (v / 100);
      clip.setAttribute("x", String(clipX));
      // 吸力與距離成反比（簡化示意）：近強遠弱
      const power = Math.round(100 * (1 - v / 100) ** 2); // 0~100
      const barW = Math.max(2, power);          // 強度條寬度
      force.setAttribute("width", String(barW));
      // 文字回饋
      readout.textContent = v < 33 ? "近" : v < 67 ? "中" : "遠";
      if (power >= 60) {
        strength.textContent = "很強，會被吸過去";
        force.setAttribute("fill", "#e63946");
      } else if (power >= 25) {
        strength.textContent = "中等";
        force.setAttribute("fill", "#f4a259");
      } else if (power > 5) {
        strength.textContent = "很弱";
        force.setAttribute("fill", "#9aa7b4");
      } else {
        strength.textContent = "吸不到了";
        force.setAttribute("fill", "#cfd6dd");
      }
    };
    slider.addEventListener("input", update);
    update();
  }

  // 4. 動畫模擬：鐵釘磁化三階段，不讓所有元素同時動。
  const scene = document.getElementById("sim-scene");
  const play = document.getElementById("sim-play");
  const caption = document.getElementById("sim-caption");
  if (scene && play && caption) {
    const stages = [
      "階段 1：普通鐵釘，裡面的小磁針方向亂亂的，不能吸東西",
      "階段 2：用磁鐵朝同一方向摩擦鐵釘，小磁針慢慢排好隊",
      "階段 3：小磁針都排好了，鐵釘變成磁鐵，能吸住迴紋針了！",
    ];
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

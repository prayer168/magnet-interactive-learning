// 互動實驗、動畫模擬、生活應用卡片與自學資源的互動邏輯。

export function initInteractions() {
  // 3-1. 實驗一：滑桿控制磁鐵與迴紋針的距離；夠近時迴紋針會「啪」地被吸過去。
  const slider = document.getElementById("demo-slider");
  const clip = document.getElementById("demo-clip");
  const force = document.getElementById("demo-force");
  const readout = document.getElementById("demo-readout");
  const strength = document.getElementById("demo-strength");
  if (slider && clip && force && readout && strength) {
    const MAGNET_EDGE = 58;      // 磁鐵 S 極右緣 x
    const ATTACH_X = 56;         // 被吸住時迴紋針貼住磁鐵的位置
    const FAR_X = 168;           // 最遠時迴紋針的位置
    const SNAP_POWER = 55;       // 吸力達此值就直接被吸過去
    const update = () => {
      const v = Number(slider.value);                   // 0=最近、100=最遠
      const power = Math.round(100 * (1 - v / 100) ** 2); // 0~100
      if (power >= SNAP_POWER) {
        // 啪！直接吸附到磁鐵上
        clip.setAttribute("x", String(ATTACH_X));
        clip.classList.add("snapped");
        force.setAttribute("width", "100");
        force.setAttribute("fill", "#e63946");
        readout.textContent = "很近";
        strength.textContent = "啪！被吸過去了";
      } else {
        clip.classList.remove("snapped");
        const nearX = MAGNET_EDGE + 14;                 // 還沒吸住時的最近位置
        const clipX = nearX + (FAR_X - nearX) * (v / 100);
        clip.setAttribute("x", String(clipX));
        force.setAttribute("width", String(Math.max(2, power)));
        readout.textContent = v < 67 ? "中" : "遠";
        if (power >= 25) {
          strength.textContent = "中等，快被吸住了";
          force.setAttribute("fill", "#f4a259");
        } else if (power > 5) {
          strength.textContent = "很弱";
          force.setAttribute("fill", "#9aa7b4");
        } else {
          strength.textContent = "吸不到了";
          force.setAttribute("fill", "#cfd6dd");
        }
      }
    };
    slider.addEventListener("input", update);
    update();
  }

  // 3-2. 實驗二：同極相斥、異極相吸（翻轉右邊磁鐵）。
  const e2scene = document.getElementById("exp2-scene");
  const e2flip = document.getElementById("exp2-flip");
  if (e2scene && e2flip) {
    const lp = document.getElementById("exp2-lp");
    const rp = document.getElementById("exp2-rp");
    const ll = document.getElementById("exp2-ll");
    const rl = document.getElementById("exp2-rl");
    const cap = document.getElementById("exp2-cap");
    const RED = "#e63946", BLUE = "#1d6fb8";
    let attract = true;          // true=異極相吸、false=同極相斥
    const apply = () => {
      // 左磁鐵面向右側的是 S 極。右磁鐵面向左側的極：相吸時為 N、相斥時為 S。
      lp.setAttribute("fill", attract ? RED : BLUE);
      rp.setAttribute("fill", attract ? BLUE : RED);
      ll.textContent = attract ? "N" : "S";
      rl.textContent = attract ? "S" : "N";
      e2scene.classList.toggle("attract", attract);
      e2scene.classList.toggle("repel", !attract);
      cap.textContent = attract
        ? "異極相吸：S 和 N 互相靠近、吸在一起。"
        : "同極相斥：S 和 S 互相推開。";
    };
    e2flip.addEventListener("click", () => { attract = !attract; apply(); });
    apply();
  }

  // 3-3. 實驗三：哪些東西會被磁鐵吸住（點按測試、分類）。
  const e3 = document.getElementById("exp3-root");
  if (e3) {
    const items = [
      { name: "迴紋針", icon: "📎", mag: true },
      { name: "鐵釘", icon: "🔩", mag: true },
      { name: "剪刀", icon: "✂️", mag: true },
      { name: "塑膠尺", icon: "📏", mag: false },
      { name: "鉛筆", icon: "✏️", mag: false },
      { name: "玻璃杯", icon: "🥛", mag: false },
    ];
    const grid = document.createElement("div");
    grid.className = "obj-row";
    const sum = document.createElement("p");
    sum.className = "exp-note";
    let tested = 0;
    items.forEach((it) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "obj";
      b.innerHTML =
        `<span class="obj-icon">${it.icon}</span>` +
        `<span class="obj-name">${it.name}</span>` +
        `<span class="obj-result">點我測試</span>`;
      b.addEventListener("click", () => {
        if (b.classList.contains("tested")) return;
        b.classList.add("tested", it.mag ? "is-yes" : "is-no");
        b.querySelector(".obj-result").textContent = it.mag ? "✅ 會被吸住" : "❌ 不會被吸";
        tested += 1;
        if (tested === items.length) {
          sum.textContent = "發現：只有「鐵」做的東西會被磁鐵吸住，塑膠、木頭、玻璃都不會。";
        }
      });
      grid.appendChild(b);
    });
    e3.appendChild(grid);
    e3.appendChild(sum);
  }

  // 3-4. 實驗四：磁鐵哪裡吸力最強（點不同位置看能黏幾根迴紋針）。
  const e4 = document.getElementById("exp4-root");
  if (e4) {
    e4.innerHTML =
      '<svg viewBox="0 0 200 60" class="exp4-mag" role="img" aria-label="條形磁鐵">' +
      '<rect x="20" y="20" width="80" height="24" rx="3" fill="#e63946"/>' +
      '<rect x="100" y="20" width="80" height="24" rx="3" fill="#1d6fb8"/>' +
      '<text x="60" y="37" font-size="13" fill="#fff" text-anchor="middle" font-weight="bold">N</text>' +
      '<text x="140" y="37" font-size="13" fill="#fff" text-anchor="middle" font-weight="bold">S</text>' +
      "</svg>";
    const row = document.createElement("div");
    row.className = "zone-row";
    const out = document.createElement("p");
    out.className = "exp-note";
    const zones = [
      { k: "左磁極（N）", clips: 5, strong: true },
      { k: "正中間", clips: 0, strong: false },
      { k: "右磁極（S）", clips: 5, strong: true },
    ];
    zones.forEach((z) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn zone-btn";
      b.textContent = z.k;
      b.addEventListener("click", () => {
        row.querySelectorAll(".zone-btn").forEach((x) => x.classList.remove("is-active"));
        b.classList.add("is-active");
        const tally = z.clips ? "📎".repeat(z.clips) : "（一根也黏不住）";
        out.innerHTML =
          `<span class="clip-tally">${tally}</span><br>` +
          (z.strong
            ? "磁極（兩端）的吸力最強，黏住好多迴紋針！"
            : "磁鐵中間幾乎沒有吸力，迴紋針黏不住。");
      });
      row.appendChild(b);
    });
    e4.appendChild(row);
    e4.appendChild(out);
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
    if (c.anim) card.dataset.anim = c.anim;   // 每張卡用對應的動作方向
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

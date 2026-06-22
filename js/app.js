// 教材進入點：載入資料並初始化各模組。
// 內容 JSON 以靜態 import 載入，交由 Vite 打包進 bundle，
// 這樣 build 後（dist/）在任何靜態主機（如 GitHub Pages）都能正確讀到。
// 切勿改回執行時 fetch('./data/*.json')：Vite build 不會複製根目錄的 data/，
// 上線後會回 404，導致生活應用／闖關／自學三個資料驅動頁籤空白。
import { initNavigation } from "./navigation.js";
import { initInteractions, renderApply, renderResources } from "./interactions.js";
import { initProgress } from "./progress.js";
import { initQuiz } from "./quiz.js";

import content from "../data/content.json";
import quiz from "../data/quiz.json";
import resources from "../data/resources.json";

function main() {
  initNavigation();
  initInteractions();
  initProgress();

  if (content) renderApply(content);
  if (quiz) initQuiz(quiz);
  if (resources) renderResources(resources);
}

document.addEventListener("DOMContentLoaded", main);

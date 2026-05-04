# 策展团队页 UI 优化计划（排版/字号/间距）

## Summary（目标概述）
在不引入图片、且不改内容数据结构（继续读取 `siteInfo.team`）的前提下，优化“策展团队”页面的**文字排版、字号层级与留白节奏**，让它更像“画册式署名/致谢页”：更舒适的阅读行宽、更清晰的层级、更稳定的中文字体呈现，并补齐可访问性细节。

用户已确认：
- 优化程度：**排版/字号/间距**
- 字体资源：**允许引入 Google Fonts**

---

## Current State Analysis（现状分析）
相关文件：
- 页面：`src/pages/Team.tsx`  
  [View file](computer:///sessions/69f80c2715f4fc8c5a70901b/workspace/zhanlan-site/src/pages/Team.tsx)
- 数据：`src/data/content.ts`（`siteInfo.team`）  
  [View file](computer:///sessions/69f80c2715f4fc8c5a70901b/workspace/zhanlan-site/src/data/content.ts)
- 全局样式/字体：`src/index.css`  
  [View file](computer:///sessions/69f80c2715f4fc8c5a70901b/workspace/zhanlan-site/src/index.css)

现状问题（基于代码与页面结构）：
1. **阅读行宽偏大**：外层 `max-w-[999px]` 对长段落致谢文来说行长过长，易疲劳。
2. **信息对齐缺少“名录感”**：Personnel 目前用 flex，角色/姓名的基线对齐与版式秩序不够稳定。
3. **中文 UI 字体不稳定**：全局 `--font-sans` 为 Inter，中文会回退到系统字体，导致风格不统一；而团队页大量小字（meta/角色）使用 `font-sans`。
4. **可访问性细节可增强**：背景大字属于装饰，应明确 `aria-hidden`；段落应使用 `<p>`；邮箱建议可点击并有键盘焦点样式。

---

## Assumptions & Decisions（假设与决策）
1. **不改文案内容与数据结构**：仍从 `siteInfo.team` 渲染。
2. **不新增图片/插图**，仅做文字排版与字体优化。
3. **字体策略：最小侵入且对中文稳定**  
   - Serif：继续 `Noto Serif SC`（当前已用）
   - Sans：新增 `Noto Sans SC`，并将 `--font-sans` 优先指向 `Noto Sans SC`，其次 `Inter`
4. **不引入 OpenCC 等内容级转换**：本任务只做 UI 排版，不触及文案规范化流程。

---

## Proposed Changes（改动方案）

### 1) 字体加载与全局字体变量（`src/index.css`，可选配合 `index.html`）
**目标**：保证中文 Sans 稳定（避免 Inter 回退），让 meta/角色信息更统一。

**实现方式 A（推荐）**：改为在 `index.html` 使用 `<link>` 加载字体（性能更可控）
1. 修改 `zhanlan-site/index.html`：
   - 增加 Google Fonts 的 `preconnect`（fonts.googleapis.com / fonts.gstatic.com）
   - 增加字体 stylesheet link：`Noto Sans SC` + `Inter` + `Noto Serif SC`
2. 修改 `src/index.css`：
   - 移除或替换顶部的 `@import url(google fonts...)`
   - 将 `@theme` 中 `--font-sans` 更新为：
     - `"Noto Sans SC", "Inter", ui-sans-serif, system-ui, sans-serif`

**实现方式 B（保守）**：继续使用 CSS `@import`，仅补上 `Noto Sans SC`
1. 在 `src/index.css` 顶部的 Google Fonts `@import` 中追加 `Noto Sans SC`
2. 更新 `--font-sans` 优先级同上

> 选择 A 或 B 都可；若担心影响全站性能，优先 A。

---

### 2) 团队页版式重排（`src/pages/Team.tsx`）
目标：更像“署名/致谢页”，明确层级并缩短阅读行宽。

#### 2.1 页面头部
- H1 从固定 `text-5xl` 调整为更克制的流体/响应式字号（可参考现有 `.text-fluid-h2` 风格，但团队页可更偏“书页感”）。
- “Credits”与“H1”之间留白稍收敛（例如 `mb-10~12`）。

#### 2.2 主体布局：12 栏网格（label 与正文分栏）
每个 section 改为：
- 外层：`grid grid-cols-12 gap-x-8 gap-y-6`
  - label：`col-span-12 md:col-span-3`
  - content：`col-span-12 md:col-span-9`
- 在 content 内部增加阅读行宽控制：
  - `max-w-[48rem]`（或类似）以控制致谢段落行长

#### 2.3 Personnel：用 dl + grid 呈现“名录排版”
将每条人员信息改为语义化结构：
- `<dl>`
  - `<dt>`：role（小字、sans、适度对比度，不做 uppercase）
  - `<dd>`：names（serif、稍大字号）
- 每条之间用轻微分隔线（沿用现有 `border-b`，但间距更统一）

#### 2.4 Acknowledgments：段落语义 + 首行缩进
将致谢数组渲染为 `<p>`：
- 每段：
  - `indent-[2em]`
  - `leading-[2.05]`
  - `text-justify-zh`
  - 段间距 `space-y-6 md:space-y-8`
- 取消每段单独的左竖线（当前每段都有 `border-l` 会偏碎）；改为整段容器统一的轻装饰（可选），或仅用留白实现层次。

#### 2.5 Contact：可点击邮箱 + focus-visible
- 将联系方式渲染为：
  - `<a href="mailto:...">...</a>`
- 加 `focus-visible:outline` 或 `underline-offset`，确保键盘可见焦点。

#### 2.6 背景大字“团”：更稳的响应式 + 可访问性
背景字是装饰，应：
- 增加 `aria-hidden="true"`、`pointer-events-none`
- 字号改为 `text-[clamp(12rem,30vw,30rem)]`，避免小屏溢出
- 使用 Motion 的 `useReducedMotion`：系统开启“减少动态效果”时禁用 parallax（y 固定为 0）

---

### 3) 可选：抽出 Team 专用样式类（`src/index.css`）
若 `Team.tsx` className 变得过长，可在 `@layer components` 增加少量 Team 专用工具类：
- `.team-section-grid`（12 栏与 gap）
- `.team-prose`（正文行高、行宽）
- `.team-paragraph`（首行缩进 + 段间距）

---

## Verification（验证与验收）
1. 代码检查：
   - `npm run lint`
   - `npm run build`
2. 页面验收（手动）：
   - `/team` 桌面端：label/正文分栏对齐，致谢段落行宽更舒适
   - 移动端：label 自动堆叠；背景字不遮挡内容
   - Personnel：角色与姓名对齐整齐（名录感）
   - Acknowledgments：段落首行缩进一致、段距舒适
   - 邮箱：可点击、Tab 可聚焦且焦点样式清晰
   - 系统开启“减少动态效果”时：背景字不再上下漂移

---

## 参考
- Motion：`useReducedMotion`（根据系统“减少动态效果”关闭/替代动画）  
  https://motion.dev/docs/react-use-reduced-motion


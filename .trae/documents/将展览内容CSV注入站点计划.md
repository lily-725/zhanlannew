# 将“展览内容.csv”注入网站数据（漫步展厅/浏览展品）—实施计划

## Summary（目标概述）
把工作区根目录的 **“展览内容.csv”** 作为网站“**漫步展厅**”（`/hall`）与“**浏览展品**”（`/collection`）的内容数据源，落地到 React+Vite 项目 **`zhanlan-site`** 的代码中：

1. **全量导入 CSV 行数据** → 生成 `Artifact[]`（展品）并用于“浏览展品/藏品详情/单元详情”页面。
2. **按“主题(章) → 次主题(节)”分组** → 生成 `Exhibition[]`（展厅/专题）与 `Unit[]`（单元）并用于“漫步展厅/专题目录/单元详情”页面。
3. **图片使用本地 import/ 目录**：将 `import/picture*.png` 复制进站点可部署的静态目录，并把 CSV 中的本机绝对路径转换为站点可访问路径。
4. 使用你提供的“主题文案”生成每个 `Exhibition` 的 `description` 与 `prologue`（首句/余文拆分）。

---

## Current State Analysis（现状分析）
### 1) 代码结构与数据入口
站点为 Vite + React，页面数据目前硬编码在：
- `zhanlan-site/src/data/content.ts`（导出 `artifacts` 与 `exhibitions`）
- `zhanlan-site/src/types.ts`（定义 `Artifact/Exhibition/Unit` 类型）

页面对数据的关键依赖（会受“图片是否存在/是否为空”影响）：
- `Exhibitions.tsx` 取封面：`ex.units[0]?.artifacts[0]?.imageUrls[0]`
- `Collections.tsx / CollectionDetail.tsx / ArticleDetail.tsx` 取图片：`art.imageUrls[0]`

### 2) CSV 结构
`展览内容.csv` 表头为：
- `主题(章), 次主题(节), 馆藏地(出处), 地址, 图片标题, 图说, 备注`

已确认存在的复杂情况：
- **字段内换行**（带引号的跨行内容），必须用“正规 CSV 解析器”，不能用简单 `split(',')`。
- `地址` 列可能出现 **多图用 `|` 分隔**。
- `地址` 列可能为空（需要兜底，避免页面 `img src=undefined`）。
- `地址` 为本机绝对路径（`/Users/.../import/pictureX.png`），需要映射到站点路径。

### 3) 图片资源现状
工作区根目录已存在：`import/picture*.png`（大量图片）。
但这些图片**不在 Vite 的 `public/` 或 `src` 资源体系内**，直接写成 `/Users/...` 路径无法在部署后的站点访问。

---

## Assumptions & Decisions（关键假设与决策）
1. **图片来源**：按你确认的要求，最终站点使用本地 `import/` 图片（而不是占位图/外链）。
2. **主题文案来源**：使用你提供的“主题段落文案”，并采用如下规则拆分：
   - `description`：该主题文案的**首句**（到第一个 `。！？` 之一为止，包含终止符；若无终止符，则取第一行）
   - `prologue`：剩余全文（trim 后保留段落换行）
3. **展品 ID 生成**：CSV 无唯一键，采用稳定可复现的序号 ID：
   - `a-0001, a-0002, ...`（按 CSV 数据行顺序）
4. **展厅/单元 ID 生成**：按 CSV 中 `主题(章)` 与 `次主题(节)` 的**首次出现顺序**生成：
   - `ex-01, ex-02, ...`
   - `u01-01, u01-02, ...`（前两位为展厅序号）
5. **多图支持**：`imageUrls` 全量保留数组（即使 UI 当前主要展示第 1 张），为后续扩展做准备。

---

## Proposed Changes（拟修改内容：文件级说明）

### A. 图片落盘到可部署位置
**目的**：让 `/import/pictureX.png` 成为站点可访问的静态资源路径。

1) 新增目录（如不存在则创建）：
- `zhanlan-site/public/import/`

2) 拷贝图片（从工作区根目录的 `import/`）：
- `import/picture*.png` → `zhanlan-site/public/import/picture*.png`

3) 数据中的图片路径统一改为：
- `imageUrls: ["/import/picture1.png", ...]`

> 备注：Vite 会把 `public/` 映射到站点根路径，因此 `/import/...` 可在 dev 与 build 后一致访问。

---

### B. 以“可重复生成”为目标：新增 CSV 导入脚本（推荐）
**目的**：避免手工复制粘贴 100+ 行数据导致漏字段/转义错误；并可在 CSV 更新后“一键再生成”。

新增文件：
1) `zhanlan-site/scripts/import-exhibition-csv.ts`
   - 输入：工作区根目录 `展览内容.csv`、以及站点 `public/import/` 目录下的图片文件
   - 输出：覆盖或生成 `zhanlan-site/src/data/content.ts`（或生成 `generatedContent.ts` 再由 `content.ts` re-export）

依赖与脚本入口：
2) 修改 `zhanlan-site/package.json`
   - 增加 dev 依赖：`csv-parse`（建议用 `csv-parse/sync`，可正确处理引号与跨行字段）
   - 增加 npm script：`"import:csv": "tsx scripts/import-exhibition-csv.ts"`
   - 如项目未使用 `tsx`，可改用 `ts-node` 或直接写 JS 脚本（择一，计划执行时需保持“决策一致”）

脚本必须实现的规则（落地细则）：
1) CSV 读取与解析
   - 正确处理：引号包裹字段、字段内逗号、字段内换行
2) 行 → Artifact 映射
   - `theme = 主题(章)`
   - `subtheme = 次主题(节)`
   - `source = 馆藏地(出处)`
   - `title = 图片标题`（把多余换行压成空格、trim）
   - `description = 图说`（trim；可保留段落换行）
   - `imageUrls`：
     - `地址` 按 `|` split（多图）
     - 每段取 basename：`picture33.png`
     - 转换为：`/import/picture33.png`
     - 过滤空值
     - 若最终为空：兜底为 `["/import/picture0.png"]`（或选一张明确的占位图）
   - `id = a-${rowIndex}`（`a-0001` 起）
3) 分组生成 exhibitions/units
   - 以 `theme` 分组为 `exhibitions`
   - 同一 `theme` 下以 `subtheme` 分组为 `units`
   - `unit.artifacts` 保持 CSV 原始顺序
   - `unit.description`：取该 unit 第一个 artifact 的 `description` 的首句（或空字符串，但必须满足类型必填）
4) 展厅文案注入
   - 在脚本内维护 `themeTextMap: Record<string,string>`（主题名 → 你提供的全文）
   - 自动拆分首句/余文写入 `ex.description` 与 `ex.prologue`
   - 若 CSV 出现未在 map 中的 theme：脚本应抛错（避免静默生成“空文案”）
5) 图片存在性校验
   - 对所有 `imageUrls`（去重后）检查对应文件是否存在于 `zhanlan-site/public/import/`
   - 缺失则输出清单并失败退出（或降级为占位图，但需在脚本里明确策略）

> 可选输出：同时生成 `zhanlan-site/src/data/import-report.json`（仅用于调试），但不是必须交付物。

---

### C. 更新站点数据文件：`src/data/content.ts`
**目的**：让页面使用 CSV 全量数据。

修改文件：
- `zhanlan-site/src/data/content.ts`

修改方式（二选一，建议选 1）：
1) **脚本覆盖生成**（推荐）
   - `content.ts` 由脚本生成，包含 `artifacts` 与 `exhibitions` 的最终数组
2) 手工替换（不推荐）
   - 把脚本输出复制粘贴进 `content.ts`（容易在引号/换行/逗号处出错）

保持不变/不在本需求内（除非你明确要一起改）：
- `siteInfo / teamMembers / aboutContent` 等其他内容字段

---

### D. UI 兜底（强烈建议）：避免图片缺失导致 broken image
**目的**：即使某些行地址为空/图片缺失，也不至于页面出现空白或报错。

修改文件（至少这些）：
- `zhanlan-site/src/pages/Exhibitions.tsx`
- `zhanlan-site/src/pages/Collections.tsx`
- `zhanlan-site/src/pages/CollectionDetail.tsx`
- `zhanlan-site/src/pages/ArticleDetail.tsx`

修改点：
- 将 `xxx.imageUrls[0]` 替换为 `xxx.imageUrls?.[0] ?? "/import/picture0.png"`

> 若想更干净，可新增工具函数（例如 `src/lib/getCoverImage.ts`），但不是必须。

---

## Verification（验证步骤）
### 1) 数据与静态校验
1. `artifacts.length` 应等于 CSV 数据行数（去掉表头）。
2. `exhibitions.length` 应等于 CSV 中主题去重数量（预计为 4）。
3. 对每个 `exhibition`：
   - `units.length` 等于该主题下次主题去重数量
   - `units[i].artifacts.length > 0`
4. 随机抽查 3 条 artifacts：
   - `title/description/source/theme/subtheme` 非空
   - `imageUrls.length >= 1` 且以 `/import/` 开头

### 2) 本地运行回归（功能链路）
在 `zhanlan-site` 下：
1. `npm install`
2. `npm run import:csv`（若采用脚本方案）
3. `npm run dev`

浏览器逐条验证：
- `/hall`：展厅列表正常、封面图可见（或至少有占位兜底）
- 点击进入 `/hall/:exId`：单元列表正常
- 点击进入 `/hall/:exId/:unitId`：展品列表、图片与文字正常；点击“查看藏品档案”可进入藏品详情
- `/collection`：网格正常、搜索过滤正常
- `/collection/:id`：大图正常、来源字段展示正常

### 3) 图片 404 排查
DevTools → Network 过滤 `picture`：
- 全部应为 `200`
- 若出现 `404 /import/pictureXX.png`：
  1) 检查 `zhanlan-site/public/import/` 是否存在该文件
  2) 检查 CSV 地址列是否引用了不存在的编号
  3) 根据脚本输出的缺失清单补齐或改用占位图策略

### 4) 构建与类型检查
- `npm run build`（确保 Vite 构建通过）
- （如项目配置了）`npm run lint`


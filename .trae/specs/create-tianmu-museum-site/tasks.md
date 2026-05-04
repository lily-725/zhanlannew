# Tasks
- [x] Task 1: 代码库与技术栈盘点
  - [x] 确认当前项目是否已存在框架（如 Next/Nuxt/Astro/Vite 等）、路由方式与构建产物形态（SSG/SSR/SPA）
  - [x] 明确部署目标（静态托管/服务器）与图片资源存储方式（本地/对象存储/CDN）

- [x] Task 2: 落地内容模型与内容数据源
  - [x] 定义 Exhibition/Section/Article/Media/CollectionItem（藏品）字段与最小必填项
  - [x] 设计内容存放目录结构与校验方式（构建时报错/运行时兜底）
  - [x] 实现按 slug/id 的数据查询与关联（展览→单元→文章；藏品→所属展览）

- [x] Task 3: 实现全站导航与响应式布局
  - [x] 桌面端：左侧固定竖向导航 + 右侧内容区域
  - [x] 桌面端：内容区两栏布局（左文右图），并在小屏自动折叠
  - [x] 移动端：顶部悬浮导航 + 侧滑汉堡菜单

- [x] Task 4: 实现面包屑与返回入口
  - [x] 为展览详情/文章/藏品等深层页面生成面包屑路径
  - [x] 藏品详情提供“返回所属展览/单元”入口

- [x] Task 5: 实现页面体系（按信息架构）
  - [x] 站点首页：项目介绍 + 漫步展厅入口与 4 个展览卡片（代表图+标题+简介）
  - [x] 展览列表页：卡片式展览浏览（实现至少一种可配置排序）
  - [x] 展览详情/目录页：展览简介 + 4 个单元入口（可配置数量）
  - [x] 单元/文章阅读页：图文段落渲染、底部跨单元跳转、目录锚点
  - [x] 浏览展品页：1:1 正方形网格缩略图
  - [x] 藏品详情页：可放大图片 + 名称/来源 + 返回所属展览链接
  - [x] 通用页：关于我们/联系信息（可选扩展免责声明/隐私政策）

- [x] Task 6: 图片策略与性能
  - [x] 图片懒加载（非首屏进入可视区才加载）
  - [x] 占位骨架与失败兜底（避免布局抖动与空白）
  - [x] 静态资源压缩与缓存头建议（gzip/br、Cache-Control）

- [x] Task 7: SEO 与站点收录能力
  - [x] 每页 title/description/OG 元信息（从内容数据生成并可覆盖）
  - [x] 生成 sitemap.xml 与 robots.txt

- [x] Task 8: 统计埋点
  - [x] 定义事件模型（PV/展览进入/目录点击/上下篇/滚动深度）
  - [x] 实现可插拔上报适配层（默认控制台/日志验证，便于后续接入平台）

- [x] Task 9: 基础可访问性与回归验证
  - [x] alt/标题层级/键盘可达的导航与按钮
  - [x] 校验关键链路：首页→展览列表→展览目录→文章页→上下篇跳转
  - [x] 移动端阅读与图片加载体验验证
  - [x] SEO 产物（sitemap/robots）验证

# Task Dependencies
- Task 3 depends on Task 1
- Task 4 depends on Task 3
- Task 5 depends on Task 2, Task 3
- Task 6 depends on Task 5
- Task 7 depends on Task 5
- Task 8 depends on Task 5
- Task 9 depends on Task 3, Task 4, Task 5, Task 6, Task 7

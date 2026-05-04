/**
 * @deprecated
 * 旧的数据入口。页面已迁移到 `src/content/*`。
 * 这里保留为兼容层，避免外部/历史引用断裂。
 */

// 展厅/展品（暂仍来自历史生成物；页面通过 src/content/exhibitions 统一访问）
export { artifacts, exhibitions } from './generated-content';

// 站点文案（新入口）
export * from '../content/site';

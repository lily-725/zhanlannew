// 临时兼容层：
// 目前展览/展品数据仍存放在 src/data/generated-content.ts（历史生成物）。
// 本目录对外提供统一的“内容层 API”，页面不再直接依赖 data/ 下的文件。
//
// 后续如果你希望彻底摆脱 CSV 生成链路，可以将数据搬迁到本目录的 artifacts.ts / exhibitions.ts。
export { artifacts, exhibitions } from '../../data/generated-content';


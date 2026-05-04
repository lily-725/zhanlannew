/**
 * 仅替换“明显繁体字”为简体字（保守策略）
 *
 * 说明：为了避免 OpenCC 在词语层面的误替换（例如把“慰藉”误改为“慰借”），
 * 这里仅做少量、明确的一对一单字替换。
 */
const TRAD_TO_SIMP_LITE: Record<string, string> = {
  '爲': '为',
  '僞': '伪',
  '啓': '启',
  '圖': '图',
  '劃': '划',
  '燬': '毁',
  '剎': '刹',
  '衆': '众',
  '瀰': '弥',
  '鍊': '炼'
};

const TRAD_TO_SIMP_LITE_RE = new RegExp(
  `[${Object.keys(TRAD_TO_SIMP_LITE).join('')}]`,
  'g'
);

export function toSimplifiedLite(input: string): string {
  if (!input) return input;
  return input.replace(TRAD_TO_SIMP_LITE_RE, (ch) => TRAD_TO_SIMP_LITE[ch] ?? ch);
}


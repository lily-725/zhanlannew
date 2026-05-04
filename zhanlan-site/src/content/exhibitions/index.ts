import type { Artifact, Exhibition } from '../../types';
import { artifacts as rawArtifacts, exhibitions as rawExhibitions } from './raw';
import { toSimplifiedLite } from '../text/toSimplifiedLite';
import { getImageTitleForIndex } from '../text/imageTitle';

// ---- Canonical stores (normalized in memory) ----

const artifactById = new Map<string, Artifact>(
  (rawArtifacts as Artifact[]).map((a) => [a.id, a])
);

function ensureImageUrls(a: Artifact): string[] {
  return a.imageUrls?.length ? a.imageUrls : ['/import/picture0.png'];
}

/**
 * 统一对外提供的 artifacts（以 rawArtifacts 为准）
 * - 仅做 imageUrls fallback，不改动文本
 */
export const artifacts: Artifact[] = (rawArtifacts as Artifact[]).map((a) => ({
  ...a,
  imageUrls: ensureImageUrls(a)
}));

/**
 * 对外提供的 exhibitions（以 artifacts 表为唯一真源“重组”每个 unit.artifacts）
 * 目的：即使 rawExhibitions 内部有重复 artifact 对象，也强制使用 artifacts 表的那一份，避免未来内容不一致。
 */
export const exhibitions: Exhibition[] = (rawExhibitions as Exhibition[]).map((ex) => ({
  ...ex,
  units: ex.units.map((u) => ({
    ...u,
    artifacts: u.artifacts
      .map((x) => artifactById.get(x.id))
      .filter(Boolean)
      .map((a) => ({ ...(a as Artifact), imageUrls: ensureImageUrls(a as Artifact) }))
  }))
}));

// ---- Query helpers (页面未来建议调用这些，而不是自己写逻辑) ----

export function getAllArtifacts(): Artifact[] {
  return artifacts;
}

export function getArtifact(id: string): Artifact | undefined {
  return artifacts.find((a) => a.id === id);
}

export function getExhibitions(): Exhibition[] {
  return exhibitions;
}

export function getExhibition(exId: string): Exhibition | undefined {
  return exhibitions.find((e) => e.id === exId);
}

export type ArtifactOccurrence = {
  exId: string;
  exTitle: string;
  unitId: string;
  unitTitle: string;
};

const occurrenceByArtifactId: Map<string, ArtifactOccurrence[]> = (() => {
  const map = new Map<string, ArtifactOccurrence[]>();
  const seen = new Map<string, Set<string>>(); // artifactId -> set(exId/unitId)

  for (const ex of exhibitions) {
    for (const unit of ex.units) {
      for (const a of unit.artifacts) {
        const key = `${ex.id}/${unit.id}`;
        const s = seen.get(a.id) ?? new Set<string>();
        if (s.has(key)) continue;
        s.add(key);
        seen.set(a.id, s);

        const arr = map.get(a.id) ?? [];
        arr.push({
          exId: ex.id,
          exTitle: ex.title,
          unitId: unit.id,
          unitTitle: unit.title
        });
        map.set(a.id, arr);
      }
    }
  }

  return map;
})();

export function getArtifactOccurrences(artifactId: string): ArtifactOccurrence[] {
  return occurrenceByArtifactId.get(artifactId) ?? [];
}

/**
 * 浏览展品：按“图片”为粒度展开（保持现有 UI 行为）
 */
export function getArtifactCards(query: string): Array<{
  art: Artifact;
  url: string;
  imageIndex: number;
  total: number;
  displayTitle: string;
}> {
  const q = toSimplifiedLite(query ?? '');
  const filtered = artifacts.filter((a) => {
    const t = toSimplifiedLite(a.title);
    const d = toSimplifiedLite(a.description);
    return t.includes(q) || d.includes(q);
  });

  return filtered.flatMap((art) => {
    const urls = ensureImageUrls(art);
    return urls.map((url, imageIndex) => ({
      art,
      url,
      imageIndex,
      total: urls.length,
      displayTitle: getImageTitleForIndex(art.title, imageIndex, urls.length) || art.title
    }));
  });
}

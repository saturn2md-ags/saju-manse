'use client';

import { GongMang, FourPillars } from '@/types/saju';
import { BRANCHES, BRANCHES_HANJA } from '@/lib/constants/branches';

interface GongMangSectionProps {
  gongMang: GongMang;
  fourPillars: FourPillars;
}

const PILLAR_LABELS: Record<string, string> = {
  year: '년주',
  month: '월주',
  day: '일주',
  hour: '시주',
};

const PILLAR_MEANINGS: Record<string, string> = {
  year: '조상·사회운',
  month: '부모·직장운',
  day: '배우자·내면',
  hour: '자녀·말년운',
};

// 공망이 사주의 어느 기둥에 걸리는지 찾기
function findHits(
  gongMangBranches: [number, number],
  fourPillars: FourPillars,
): { pillarKey: string; branch: number }[] {
  const hits: { pillarKey: string; branch: number }[] = [];
  const pillarEntries = [
    { key: 'year', branch: fourPillars.year.branch },
    { key: 'month', branch: fourPillars.month.branch },
    { key: 'day', branch: fourPillars.day.branch },
    ...(fourPillars.hour ? [{ key: 'hour', branch: fourPillars.hour.branch }] : []),
  ];

  for (const { key, branch } of pillarEntries) {
    if (gongMangBranches.includes(branch)) {
      hits.push({ pillarKey: key, branch });
    }
  }
  return hits;
}

// 기둥별 공망 해석 (쉬운 말로)
function getHitDescription(pillarKey: string): string {
  switch (pillarKey) {
    case 'year':
      return '조상이나 윗사람의 도움이 약할 수 있어요. 대신 스스로 개척하는 힘이 강해요!';
    case 'month':
      return '직장이나 부모와의 인연이 희미할 수 있어요. 하지만 자유로운 커리어를 만들기 좋아요!';
    case 'day':
      return '배우자 복이 다소 약하거나 내면이 공허할 수 있어요. 정신적·영적 성장에 유리해요!';
    case 'hour':
      return '자녀와의 인연이 담백하거나 말년이 조용할 수 있어요. 오히려 자유로운 노후가 될 수 있어요!';
    default:
      return '';
  }
}

export default function GongMangSection({ gongMang, fourPillars }: GongMangSectionProps) {
  const yearHits = findHits(gongMang.yearGongMang, fourPillars);
  const dayHits = findHits(gongMang.dayGongMang, fourPillars);
  const hasAnyHit = yearHits.length > 0 || dayHits.length > 0;

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <h2 className="text-lg font-bold text-white mb-1">공망 (空亡)</h2>
      <p className="text-sm text-gray-400 mb-4">
        공망은 &quot;비어있는 자리&quot;예요. 해당 에너지가 약해지지만, 집착이 줄어 오히려 자유로워질 수 있어요.
      </p>

      {/* 년주 공망 */}
      <GongMangRow
        label="년주 공망"
        branches={gongMang.yearGongMang}
        hits={yearHits}
        fourPillars={fourPillars}
      />

      {/* 일주 공망 */}
      <GongMangRow
        label="일주 공망"
        branches={gongMang.dayGongMang}
        hits={dayHits}
        fourPillars={fourPillars}
      />

      {/* 종합 해석 */}
      <div className="mt-3 p-3 bg-black/20 rounded-xl">
        {hasAnyHit ? (
          <>
            <p className="text-sm text-amber-400 font-medium mb-1">내 사주에 공망이 걸려 있어요</p>
            <div className="space-y-1.5">
              {[...dayHits, ...yearHits.filter(yh => !dayHits.some(dh => dh.pillarKey === yh.pillarKey))].map((hit, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-xs text-amber-500 mt-0.5 shrink-0">▸</span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <span className="text-amber-400 font-medium">{PILLAR_LABELS[hit.pillarKey]}({PILLAR_MEANINGS[hit.pillarKey]})</span>
                    {' '}{getHitDescription(hit.pillarKey)}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-emerald-400">
            공망에 해당하는 지지가 사주에 없어요. 공망의 영향이 거의 없는 안정적인 구조!
          </p>
        )}
      </div>
    </div>
  );
}

function GongMangRow({
  label,
  branches,
  hits,
  fourPillars,
}: {
  label: string;
  branches: [number, number];
  hits: { pillarKey: string; branch: number }[];
  fourPillars: FourPillars;
}) {
  // 사주에 있는 지지 목록
  const sajuBranches = [
    fourPillars.year.branch,
    fourPillars.month.branch,
    fourPillars.day.branch,
    ...(fourPillars.hour ? [fourPillars.hour.branch] : []),
  ];

  return (
    <div className="bg-black/30 rounded-xl p-3 mb-2">
      <h3 className="text-xs text-gray-400 mb-2">{label}</h3>
      <div className="flex gap-2">
        {branches.map((b, i) => {
          const isHit = sajuBranches.includes(b);
          const hitPillar = hits.find(h => h.branch === b);

          return (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-1 rounded-lg px-3 py-1 ${
                isHit ? 'bg-amber-900/30 ring-1 ring-amber-700/50' : 'bg-gray-800'
              }`}>
                <span className={`text-lg font-bold ${isHit ? 'text-amber-400' : 'text-gray-300'}`}>
                  {BRANCHES_HANJA[b]}
                </span>
                <span className={`text-xs ${isHit ? 'text-amber-500' : 'text-gray-500'}`}>
                  ({BRANCHES[b]})
                </span>
              </div>
              {hitPillar && (
                <span className="text-xs text-amber-500">
                  ← {PILLAR_LABELS[hitPillar.pillarKey]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

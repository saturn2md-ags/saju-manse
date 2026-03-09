'use client';

import { GongMang } from '@/types/saju';
import { BRANCHES, BRANCHES_HANJA } from '@/lib/constants/branches';

interface GongMangSectionProps {
  gongMang: GongMang;
}

export default function GongMangSection({ gongMang }: GongMangSectionProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <h2 className="text-lg font-bold text-white mb-1">공망 (空亡)</h2>
      <p className="text-sm text-gray-400 mb-4">
        비어있는 에너지. 해당 지지의 힘이 약해지지만, 영적인 직감이 발달할 수 있어요.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/30 rounded-xl p-3">
          <h3 className="text-xs text-gray-400 mb-2">년주 공망</h3>
          <div className="flex gap-2">
            {gongMang.yearGongMang.map((b, i) => (
              <div key={i} className="flex items-center gap-1 bg-gray-800 rounded-lg px-3 py-1">
                <span className="text-lg font-bold text-gray-300">{BRANCHES_HANJA[b]}</span>
                <span className="text-xs text-gray-500">({BRANCHES[b]})</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-black/30 rounded-xl p-3">
          <h3 className="text-xs text-gray-400 mb-2">일주 공망</h3>
          <div className="flex gap-2">
            {gongMang.dayGongMang.map((b, i) => (
              <div key={i} className="flex items-center gap-1 bg-gray-800 rounded-lg px-3 py-1">
                <span className="text-lg font-bold text-gray-300">{BRANCHES_HANJA[b]}</span>
                <span className="text-xs text-gray-500">({BRANCHES[b]})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        공망에 해당하는 지지가 사주에 있으면 그 자리의 에너지가 약해져요. 하지만 오히려 세속적인 것보다 정신적, 영적인 분야에서 빛날 수 있어요!
      </p>
    </div>
  );
}

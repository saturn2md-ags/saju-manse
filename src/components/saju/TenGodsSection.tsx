'use client';

import { FourPillars } from '@/types/saju';
import { analyzeTenGods } from '@/lib/saju/tenGods';
import { TEN_GOD_INTERPRETATIONS } from '@/data/interpretations/tenGods';
import { TenGod } from '@/types/saju';
import { useState } from 'react';

interface TenGodsSectionProps {
  pillars: FourPillars;
}

export default function TenGodsSection({ pillars }: TenGodsSectionProps) {
  const analysis = analyzeTenGods(pillars);
  const [expandedGod, setExpandedGod] = useState<TenGod | null>(null);

  // 십성별 존재하는 것만 표시 (개수 > 0)
  const presentGods = (Object.entries(analysis.counts) as [TenGod, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <h2 className="text-lg font-bold text-white mb-1">십성 분석 (十星)</h2>
      <p className="text-sm text-gray-400 mb-4">
        일간(나)을 기준으로 다른 기운들이 나에게 어떤 의미인지 보여줘요
      </p>

      {/* 사주 내 십성 배치 */}
      <div className="grid grid-cols-4 gap-2 mb-4 bg-black/30 rounded-xl p-3">
        <div className="text-center">
          <div className="text-xs text-gray-500">시간</div>
          <div className="text-sm text-white font-bold">{analysis.hourStem}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-blue-400">일간</div>
          <div className="text-sm text-blue-400 font-bold">나</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">월간</div>
          <div className="text-sm text-white font-bold">{analysis.monthStem}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">년간</div>
          <div className="text-sm text-white font-bold">{analysis.yearStem}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">시지</div>
          <div className="text-sm text-gray-300">{analysis.hourBranch}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">일지</div>
          <div className="text-sm text-gray-300">{analysis.dayBranch}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">월지</div>
          <div className="text-sm text-gray-300">{analysis.monthBranch}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">년지</div>
          <div className="text-sm text-gray-300">{analysis.yearBranch}</div>
        </div>
      </div>

      {/* 십성 카드들 */}
      <div className="space-y-2">
        {presentGods.map(([god, count]) => {
          const interp = TEN_GOD_INTERPRETATIONS[god];
          const isExpanded = expandedGod === god;

          return (
            <div key={god} className="bg-black/30 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center gap-3 p-3 text-left"
                onClick={() => setExpandedGod(isExpanded ? null : god)}
              >
                <span className="text-2xl">{interp.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{god}</span>
                    <span className="text-xs text-gray-400">{interp.keyword}</span>
                    <span className="ml-auto text-xs bg-purple-800/50 text-purple-300 px-2 py-0.5 rounded-full">
                      {count}개
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{interp.shortDesc}</p>
                </div>
                <span className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-2 border-t border-gray-800 pt-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{interp.personality}</p>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-xs text-green-400">강점:</span>
                      <span className="text-xs text-gray-300 ml-1">{interp.strength}</span>
                    </div>
                    <div>
                      <span className="text-xs text-red-400">약점:</span>
                      <span className="text-xs text-gray-300 ml-1">{interp.weakness}</span>
                    </div>
                    <div>
                      <span className="text-xs text-blue-400">직업:</span>
                      <span className="text-xs text-gray-300 ml-1">{interp.career}</span>
                    </div>
                    <div>
                      <span className="text-xs text-pink-400">연애:</span>
                      <span className="text-xs text-gray-300 ml-1">{interp.love}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 없는 십성 */}
      {analysis.missingGods.length > 0 && (
        <div className="mt-3 bg-yellow-900/20 rounded-xl p-3">
          <h3 className="text-xs text-yellow-400 font-bold mb-1">사주에 없는 십성</h3>
          <div className="flex flex-wrap gap-1">
            {analysis.missingGods.map((god) => (
              <span key={god} className="text-xs bg-yellow-800/30 text-yellow-300 px-2 py-0.5 rounded-full">
                {god}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            없는 십성은 대운이나 세운에서 들어올 때 영향을 받아요
          </p>
        </div>
      )}
    </div>
  );
}

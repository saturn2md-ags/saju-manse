'use client';

import { FourPillars } from '@/types/saju';
import { analyzeJohu } from '@/lib/saju/johu';

interface JohuSectionProps {
  pillars: FourPillars;
}

const ELEMENT_EMOJI: Record<string, string> = {
  '목': '🌳', '화': '🔥', '토': '🏔️', '금': '⚙️', '수': '💧',
};

const SCORE_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  '상': { bg: 'bg-emerald-900/40', text: 'text-emerald-400', label: '조후 충족' },
  '중': { bg: 'bg-amber-900/40', text: 'text-amber-400', label: '부분 충족' },
  '하': { bg: 'bg-red-900/40', text: 'text-red-400', label: '조후 부족' },
};

export default function JohuSection({ pillars }: JohuSectionProps) {
  const johu = analyzeJohu(pillars);
  const style = SCORE_STYLE[johu.score];

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-white">조후보정 (調候)</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text} font-bold`}>
          {style.label}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-4">태어난 계절에 따른 오행 균형이에요</p>

      {/* 계절 정보 */}
      <div className="bg-black/30 rounded-xl p-3 mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-bold text-white">{johu.season} 출생</span>
          <span className="text-xs text-gray-400">{johu.seasonDesc}</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{johu.neededReason}</p>
      </div>

      {/* 필요 오행 체크 */}
      <div className="flex gap-2 mb-3">
        {johu.needed.map(el => {
          const isFound = johu.found.includes(el);
          return (
            <div
              key={el}
              className={`flex-1 rounded-xl p-3 border text-center ${
                isFound
                  ? 'bg-emerald-900/20 border-emerald-700/50'
                  : 'bg-red-900/20 border-red-700/50'
              }`}
            >
              <div className="text-2xl mb-1">{ELEMENT_EMOJI[el]}</div>
              <div className="text-sm font-bold text-white">{el}</div>
              <div className={`text-xs mt-0.5 ${isFound ? 'text-emerald-400' : 'text-red-400'}`}>
                {isFound ? '사주에 있음 ✓' : '사주에 없음 ✗'}
              </div>
            </div>
          );
        })}
      </div>

      {/* 종합 해석 */}
      <div className={`rounded-xl p-3 ${style.bg} border border-gray-800`}>
        <p className="text-sm text-gray-300 leading-relaxed">{johu.interpretation}</p>
      </div>
    </div>
  );
}

'use client';

import { DAY_MASTER_INTERPRETATIONS } from '@/data/interpretations/dayMasters';

interface DayMasterCardProps {
  stemIndex: number;
}

export default function DayMasterCard({ stemIndex }: DayMasterCardProps) {
  const interp = DAY_MASTER_INTERPRETATIONS[stemIndex];

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-6 border border-purple-800/50">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{interp.emoji}</span>
        <div>
          <h2 className="text-lg font-bold text-white">
            {interp.hanja} {interp.stem} ({interp.element})
          </h2>
          <p className="text-sm text-purple-300">{interp.nickname}</p>
        </div>
      </div>

      <p className="text-white text-sm mb-4">{interp.shortDesc}</p>

      <div className="bg-black/30 rounded-xl p-4 mb-4">
        <p className="text-gray-300 text-sm leading-relaxed">{interp.personality}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-900/30 rounded-xl p-3">
          <h3 className="text-xs text-green-400 font-bold mb-2">강점</h3>
          <div className="flex flex-wrap gap-1">
            {interp.strengths.map((s) => (
              <span key={s} className="text-xs bg-green-800/40 text-green-300 px-2 py-0.5 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-red-900/30 rounded-xl p-3">
          <h3 className="text-xs text-red-400 font-bold mb-2">약점</h3>
          <div className="flex flex-wrap gap-1">
            {interp.weaknesses.map((w) => (
              <span key={w} className="text-xs bg-red-800/40 text-red-300 px-2 py-0.5 rounded-full">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <span className="text-xs text-gray-400 shrink-0">궁합:</span>
          <span className="text-xs text-gray-300">{interp.bestMatch}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs text-gray-400 shrink-0">조언:</span>
          <span className="text-xs text-yellow-300">{interp.advice}</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { DaeunCycle } from '@/types/saju';
import { STEMS_HANJA, STEM_ELEMENTS } from '@/lib/constants/stems';
import { BRANCHES_HANJA, BRANCH_ELEMENTS } from '@/lib/constants/branches';
import { useState, useMemo } from 'react';
import { ELEMENT_BG, TEN_GOD_DESC, GROWTH_DESC, getStarDescription, getStarEmoji } from './luckInterpretations';

interface DaeunTimelineProps {
  cycles: DaeunCycle[];
  startAge: number;
  direction: '순행' | '역행';
  birthYear: number;
}

export default function DaeunTimeline({ cycles, startAge, direction, birthYear }: DaeunTimelineProps) {
  const currentAge = new Date().getFullYear() - birthYear + 1;

  const currentIdx = useMemo(() => {
    const idx = cycles.findIndex(c => currentAge >= c.startAge && currentAge < c.startAge + 10);
    return idx >= 0 ? idx : 0;
  }, [cycles, currentAge]);

  const [selectedIdx, setSelectedIdx] = useState<number>(currentIdx);

  const selected = cycles[selectedIdx];

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-white">대운 (大運)</h2>
        <span className="text-xs text-gray-400">
          대운수: {startAge}세 | {direction}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-4">10년마다 바뀌는 인생의 큰 흐름이에요</p>

      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex gap-2 min-w-max pt-1 pb-2">
          {cycles.map((cycle, idx) => {
            const isCurrent = currentAge >= cycle.startAge && currentAge < cycle.startAge + 10;
            const isSelected = selectedIdx === idx;
            const stemEl = STEM_ELEMENTS[cycle.stem];
            const branchEl = BRANCH_ELEMENTS[cycle.branch];

            return (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl min-w-[68px] transition-all ${
                  isSelected ? 'bg-purple-900/50 ring-2 ring-purple-500' : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="text-xs text-gray-400">
                  {birthYear + cycle.startAge - 1}년
                </div>
                <div className="text-xs font-bold text-white">
                  {cycle.startAge}세
                </div>
                <div className="text-xs text-gray-400">{cycle.tenGod}</div>
                <div className={`w-12 h-12 ${ELEMENT_BG[stemEl]} rounded-lg flex items-center justify-center border`}>
                  <span className="text-xl font-bold text-white">
                    {STEMS_HANJA[cycle.stem]}
                  </span>
                </div>
                <div className={`w-12 h-12 ${ELEMENT_BG[branchEl]} rounded-lg flex items-center justify-center border`}>
                  <span className="text-xl font-bold text-white">
                    {BRANCHES_HANJA[cycle.branch]}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{cycle.branchTenGod}</div>
                <div className="text-xs text-gray-500">{cycle.growthStage}</div>
                {cycle.specialStars.length > 0 && (
                  <div className="flex flex-col items-center gap-0.5 mt-0.5">
                    {cycle.specialStars.slice(0, 2).map((star) => (
                      <span key={star} className="text-[11px] text-yellow-400/80">{star}</span>
                    ))}
                    {cycle.specialStars.length > 2 && (
                      <span className="text-[11px] text-gray-500">+{cycle.specialStars.length - 2}</span>
                    )}
                  </div>
                )}
                {isCurrent && (
                  <div className="text-xs text-purple-400 font-bold mt-0.5">현재</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="mt-3 bg-black/30 rounded-xl p-3 border border-gray-800 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">
              {selected.startAge}세 ~ {selected.startAge + 9}세
            </span>
            <span className="text-xs text-gray-400">
              ({birthYear + selected.startAge - 1}~{birthYear + selected.startAge + 8}년)
            </span>
          </div>

          <div className="space-y-1 text-sm">
            <div>
              <span className="text-gray-500">천간:</span>
              <span className="text-white ml-1 font-bold">{selected.tenGod}</span>
              <span className="text-gray-400 ml-1">({STEMS_HANJA[selected.stem]} {STEM_ELEMENTS[selected.stem]})</span>
            </div>
            <div>
              <span className="text-gray-500">지지:</span>
              <span className="text-white ml-1 font-bold">{selected.branchTenGod}</span>
              <span className="text-gray-400 ml-1">({BRANCHES_HANJA[selected.branch]} {BRANCH_ELEMENTS[selected.branch]})</span>
            </div>
            <div>
              <span className="text-gray-500">12운성:</span>
              <span className="text-white ml-1">{selected.growthStage}</span>
            </div>
            {selected.specialStars.length > 0 && (
              <div>
                <span className="text-gray-500">신살:</span>
                <span className="text-yellow-400 ml-1">{selected.specialStars.join(', ')}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            {TEN_GOD_DESC[selected.tenGod]} {GROWTH_DESC[selected.growthStage]}
          </p>

          {selected.specialStars.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-gray-800">
              <div className="text-xs text-gray-500 font-bold">신살 해석</div>
              {selected.specialStars.map((star) => (
                <div key={star} className="flex items-start gap-1.5 text-sm">
                  <span>{getStarEmoji(star)}</span>
                  <div>
                    <span className="text-yellow-400 font-bold">{star}</span>
                    <span className="text-gray-400 ml-1">- {getStarDescription(star)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

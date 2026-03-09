'use client';

import { AnnualLuck } from '@/types/saju';
import { STEMS_HANJA, STEM_ELEMENTS } from '@/lib/constants/stems';
import { BRANCHES_HANJA, BRANCH_ELEMENTS } from '@/lib/constants/branches';
import { useState } from 'react';
import { ELEMENT_BG, TEN_GOD_DESC, GROWTH_DESC, getStarDescription, getStarEmoji } from './luckInterpretations';

interface AnnualLuckListProps {
  annualLuck: AnnualLuck[];
}

export default function AnnualLuckList({ annualLuck }: AnnualLuckListProps) {
  const currentYear = new Date().getFullYear();
  const currentIdx = annualLuck.findIndex(l => l.year === currentYear);
  const [selectedIdx, setSelectedIdx] = useState<number>(currentIdx >= 0 ? currentIdx : 0);

  const selected = annualLuck[selectedIdx];

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <h2 className="text-lg font-bold text-white mb-1">세운 (歲運)</h2>
      <p className="text-sm text-gray-400 mb-4">매년 바뀌는 운의 흐름이에요</p>

      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex gap-2 min-w-max pt-1 pb-2">
          {annualLuck.map((luck, idx) => {
            const isCurrent = luck.year === currentYear;
            const isSelected = selectedIdx === idx;
            const stemEl = STEM_ELEMENTS[luck.stem];
            const branchEl = BRANCH_ELEMENTS[luck.branch];

            return (
              <button
                key={luck.year}
                onClick={() => setSelectedIdx(idx)}
                className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl min-w-[68px] transition-all ${
                  isSelected ? 'bg-purple-900/50 ring-2 ring-purple-500' : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="text-xs font-bold text-white">{luck.year}</div>
                <div className="text-xs text-gray-400">{luck.tenGod}</div>
                <div className={`w-12 h-12 ${ELEMENT_BG[stemEl]} rounded-lg flex items-center justify-center border`}>
                  <span className="text-xl font-bold text-white">
                    {STEMS_HANJA[luck.stem]}
                  </span>
                </div>
                <div className={`w-12 h-12 ${ELEMENT_BG[branchEl]} rounded-lg flex items-center justify-center border`}>
                  <span className="text-xl font-bold text-white">
                    {BRANCHES_HANJA[luck.branch]}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{luck.branchTenGod}</div>
                <div className="text-xs text-gray-500">{luck.growthStage}</div>
                {luck.specialStars.length > 0 && (
                  <div className="flex flex-col items-center gap-0.5 mt-0.5">
                    {luck.specialStars.slice(0, 2).map((star) => (
                      <span key={star} className="text-[11px] text-yellow-400/80">{star}</span>
                    ))}
                    {luck.specialStars.length > 2 && (
                      <span className="text-[11px] text-gray-500">+{luck.specialStars.length - 2}</span>
                    )}
                  </div>
                )}
                {isCurrent && (
                  <div className="text-xs text-purple-400 font-bold mt-0.5">올해</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="mt-3 bg-black/30 rounded-xl p-3 border border-gray-800 space-y-2.5">
          <div className="text-sm font-bold text-white">{selected.year}년 세운</div>
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

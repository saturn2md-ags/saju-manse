'use client';

import { Interaction } from '@/types/saju';
import { INTERACTION_INTERPRETATIONS } from '@/data/interpretations/interactions';
import { useState } from 'react';

interface InteractionsSectionProps {
  interactions: Interaction[];
}

// 기둥 조합별 쉬운 설명 (년=사회/윗사람, 월=직장/부모, 일=나, 시=자녀/미래)
function getPositionLabel(positions: string[]): string {
  const pillars = [...new Set(positions.map(p => p.replace(/[간지]$/, '')))].sort();
  const key = pillars.join('-');

  const labels: Record<string, string> = {
    '년-월': '사회·직장 사이',
    '년-일': '윗사람과 나 사이',
    '년-시': '과거와 미래 사이',
    '월-일': '직장·부모와 나 사이',
    '월-시': '직장과 자녀·미래 사이',
    '일-시': '나와 자녀 사이',
    '년-월-일': '사회·직장·나를 잇는 큰 흐름',
    '년-월-시': '사회·직장·미래를 잇는 큰 흐름',
    '년-일-시': '윗사람·나·자녀를 잇는 큰 흐름',
    '월-일-시': '직장·나·자녀를 잇는 큰 흐름',
    '년-월-일-시': '사주 전체를 관통하는 흐름',
  };
  return labels[key] || positions.join(' ↔ ');
}

export default function InteractionsSection({ interactions }: InteractionsSectionProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (interactions.length === 0) {
    return (
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-1">합충형파해</h2>
        <p className="text-sm text-gray-400">사주 내에 특별한 합이나 충이 없어요. 안정적인 구조!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <h2 className="text-lg font-bold text-white mb-1">합충형파해</h2>
      <p className="text-sm text-gray-400 mb-4">사주 안의 기운들이 서로 어떻게 작용하는지 보여줘요</p>

      <div className="space-y-2">
        {interactions.map((inter, idx) => {
          const interp = INTERACTION_INTERPRETATIONS[inter.type];
          const isExpanded = expandedIdx === idx;

          return (
            <div key={idx} className={`rounded-xl overflow-hidden ${interp?.isPositive ? 'bg-blue-900/20' : 'bg-red-900/20'}`}>
              <button
                className="w-full flex items-center gap-3 p-3 text-left"
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
              >
                <span className="text-xl">{interp?.emoji || '🔄'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      interp?.isPositive ? 'bg-blue-800/50 text-blue-300' : 'bg-red-800/50 text-red-300'
                    }`}>
                      {inter.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {inter.positions.join(' ↔ ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-0.5">{inter.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{getPositionLabel(inter.positions)}</p>
                </div>
                <span className={`text-gray-500 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {isExpanded && interp && (
                <div className="px-3 pb-3 border-t border-gray-800 pt-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{interp.fullDesc}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

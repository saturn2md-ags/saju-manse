'use client';

import { Interaction } from '@/types/saju';
import { INTERACTION_INTERPRETATIONS } from '@/data/interpretations/interactions';
import { useState } from 'react';

interface InteractionsSectionProps {
  interactions: Interaction[];
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
                    <span className="text-xs text-gray-400">
                      {inter.positions.join(' ↔ ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-0.5">{inter.description}</p>
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

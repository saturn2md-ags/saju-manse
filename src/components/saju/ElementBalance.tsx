'use client';

import { ElementBalance as ElementBalanceType } from '@/types/saju';
import { getElementPercentages } from '@/lib/saju/elements';

const ELEMENT_INFO: { key: string; name: string; hanja: string; color: string; bgColor: string }[] = [
  { key: '목', name: '나무', hanja: '木', color: 'bg-green-500', bgColor: 'bg-green-500/20' },
  { key: '화', name: '불', hanja: '火', color: 'bg-red-500', bgColor: 'bg-red-500/20' },
  { key: '토', name: '흙', hanja: '土', color: 'bg-yellow-500', bgColor: 'bg-yellow-500/20' },
  { key: '금', name: '쇠', hanja: '金', color: 'bg-slate-400', bgColor: 'bg-slate-400/20' },
  { key: '수', name: '물', hanja: '水', color: 'bg-blue-500', bgColor: 'bg-blue-500/20' },
];

interface ElementBalanceProps {
  balance: ElementBalanceType;
}

export default function ElementBalanceComponent({ balance }: ElementBalanceProps) {
  const percentages = getElementPercentages(balance);

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <h2 className="text-lg font-bold text-white mb-2">오행 밸런스 (五行)</h2>
      <p className="text-sm text-gray-400 mb-4">당신의 에너지가 어떻게 분포되어 있는지 보여줘요</p>

      <div className="space-y-2.5">
        {ELEMENT_INFO.map(({ key, name, hanja, color, bgColor }) => {
          const pct = percentages[key] || 0;
          return (
            <div key={key} className="flex items-center gap-3">
              <div className="w-16 flex items-center gap-1">
                <span className="text-sm font-bold text-white">{hanja}</span>
                <span className="text-xs text-gray-400">{name}</span>
              </div>
              <div className={`flex-1 h-6 ${bgColor} rounded-full overflow-hidden`}>
                <div
                  className={`h-full ${color} rounded-full transition-all duration-1000 flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max(pct, 5)}%` }}
                >
                  {pct > 10 && (
                    <span className="text-xs font-bold text-white">{pct}%</span>
                  )}
                </div>
              </div>
              {pct <= 10 && (
                <span className="text-xs text-gray-400 w-8">{pct}%</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {ELEMENT_INFO.map(({ key, hanja, color }) => {
          const raw = balance[key as keyof ElementBalanceType];
          return (
            <span key={key} className={`px-2 py-1 rounded-full text-xs text-white ${color}/80`}>
              {hanja} {raw.toFixed(1)}
            </span>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { Pillar } from '@/types/saju';
import { STEMS, STEMS_HANJA } from '@/lib/constants/stems';
import { BRANCHES, BRANCHES_HANJA } from '@/lib/constants/branches';
import { STEM_ELEMENTS, STEM_YINYANG } from '@/lib/constants/stems';
import { BRANCH_ELEMENTS, BRANCH_YINYANG } from '@/lib/constants/branches';

const ELEMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '목': { bg: 'bg-green-700', text: 'text-green-400', border: 'border-green-500' },
  '화': { bg: 'bg-red-700', text: 'text-red-400', border: 'border-red-500' },
  '토': { bg: 'bg-yellow-700', text: 'text-yellow-400', border: 'border-yellow-500' },
  '금': { bg: 'bg-slate-500', text: 'text-slate-200', border: 'border-slate-400' },
  '수': { bg: 'bg-blue-700', text: 'text-blue-400', border: 'border-blue-500' },
};

interface PillarColumnProps {
  pillar: Pillar;
  label: string;
  isDayMaster?: boolean;
}

export default function PillarColumn({ pillar, label, isDayMaster }: PillarColumnProps) {
  const stemElement = STEM_ELEMENTS[pillar.stem];
  const branchElement = BRANCH_ELEMENTS[pillar.branch];
  const stemColors = ELEMENT_COLORS[stemElement];
  const branchColors = ELEMENT_COLORS[branchElement];

  return (
    <div className="flex flex-col items-center gap-1">
      {/* 라벨 */}
      <div className={`text-xs ${isDayMaster ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
        {label}
      </div>

      {/* 십성 */}
      {isDayMaster ? (
        <div className="text-xs text-blue-400">일간(나)</div>
      ) : pillar.tenGod ? (
        <div className="text-xs text-gray-400">{pillar.tenGod}</div>
      ) : null}

      {/* 천간 */}
      <div className={`w-16 h-16 ${stemColors.bg} rounded-lg flex items-center justify-center border ${stemColors.border}`}>
        <span className="text-3xl font-bold text-white">
          {STEMS_HANJA[pillar.stem]}
        </span>
      </div>

      {/* 지지 */}
      <div className={`w-16 h-16 ${branchColors.bg} rounded-lg flex items-center justify-center border ${branchColors.border}`}>
        <span className="text-3xl font-bold text-white">
          {BRANCHES_HANJA[pillar.branch]}
        </span>
      </div>

      {/* 한글 읽기 */}
      <div className="text-xs text-gray-400">
        {STEMS[pillar.stem]}{BRANCHES[pillar.branch]}
      </div>

      {/* 12운성 */}
      {pillar.growthStage && (
        <div className="text-xs text-gray-500">{pillar.growthStage}</div>
      )}
    </div>
  );
}

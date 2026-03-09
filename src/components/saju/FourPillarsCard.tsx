'use client';

import { FourPillars } from '@/types/saju';
import PillarColumn from './PillarColumn';

interface FourPillarsCardProps {
  pillars: FourPillars;
}

export default function FourPillarsCard({ pillars }: FourPillarsCardProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <h2 className="text-lg font-bold text-white mb-4 text-center">사주팔자 (四柱八字)</h2>

      {/* 사주 기둥들 - 시일월년 순서 (전통 배열) */}
      <div className="grid grid-cols-4 gap-2 justify-items-center">
        <PillarColumn pillar={pillars.hour} label="시주" />
        <PillarColumn pillar={pillars.day} label="일주" isDayMaster />
        <PillarColumn pillar={pillars.month} label="월주" />
        <PillarColumn pillar={pillars.year} label="년주" />
      </div>
    </div>
  );
}

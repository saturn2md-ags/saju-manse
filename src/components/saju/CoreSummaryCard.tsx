'use client';

import { FourPillars } from '@/types/saju';
import { DAY_MASTER_INTERPRETATIONS } from '@/data/interpretations/dayMasters';
import { getDayPillarInterpretation } from '@/data/interpretations/dayPillars';
import { determineGyeokGuk, analyzeTenGodSummary } from '@/lib/saju/coreSummary';
import { useState } from 'react';

interface CoreSummaryCardProps {
  pillars: FourPillars;
}

export default function CoreSummaryCard({ pillars }: CoreSummaryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const dayMasterIdx = pillars.day.stem;
  const dm = DAY_MASTER_INTERPRETATIONS[dayMasterIdx];
  const dp = getDayPillarInterpretation(pillars.day.stem, pillars.day.branch);
  const gyeokguk = determineGyeokGuk(pillars);
  const tenGodSummary = analyzeTenGodSummary(pillars);

  return (
    <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 rounded-2xl p-4 border border-indigo-800/50">
      <h2 className="text-lg font-bold text-white mb-1">나의 사주 핵심</h2>
      <p className="text-xs text-indigo-300/70 mb-4">당신의 사주를 한눈에 파악하세요</p>

      {/* 일주 프로필 (핵심) */}
      <div className="flex items-start gap-3 mb-3">
        <div className="text-4xl">{dm.emoji}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold text-white">
              {dp ? dp.name : `${dm.stem}(${dm.hanja})`}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-800/50 text-indigo-300">
              {dm.element} · {dm.nickname}
            </span>
          </div>
          <p className="text-sm text-gray-300">
            {dp ? dp.shortDesc : dm.shortDesc}
          </p>
        </div>
      </div>

      {/* 일주 상세 해석 */}
      {dp && (
        <div className="bg-black/20 rounded-xl p-3 mb-3">
          <p className="text-xs font-bold text-amber-400 mb-1.5">{dp.keyword}</p>
          <p className="text-sm text-gray-300 leading-relaxed">{dp.detail}</p>
          <div className="mt-2 pt-2 border-t border-gray-700/50">
            <p className="text-xs text-pink-400 font-bold mb-1">연애·배우자</p>
            <p className="text-sm text-gray-300 leading-relaxed">{dp.relationship}</p>
          </div>
        </div>
      )}

      {/* 격국 */}
      <div className="bg-black/20 rounded-xl p-3 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-amber-400">{gyeokguk.name}</span>
          <span className="text-xs text-gray-400">· {gyeokguk.keyword}</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{gyeokguk.description}</p>
      </div>

      {/* 종합 (접이식) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left bg-black/20 rounded-xl p-3 hover:bg-black/30 transition-colors"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-gray-400">일간 성격 · 종합 분석</span>
          <span className={`text-gray-500 text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
        </div>
        <p className="text-sm text-gray-300">{dm.personality}</p>

        {expanded && (
          <div className="mt-3 space-y-2.5 border-t border-gray-700/50 pt-3">
            {/* 강점/약점 */}
            <div>
              <p className="text-xs text-emerald-400 font-bold mb-1.5">강점</p>
              <div className="flex flex-wrap gap-1.5">
                {dm.strengths.map(s => (
                  <span key={s} className="text-xs bg-emerald-900/30 text-emerald-300 px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-orange-400 font-bold mb-1.5">약점</p>
              <div className="flex flex-wrap gap-1.5">
                {dm.weaknesses.map(w => (
                  <span key={w} className="text-xs bg-orange-900/30 text-orange-300 px-2 py-0.5 rounded">{w}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-indigo-400 font-bold mb-1">직업 적성</p>
              <p className="text-sm text-gray-300">{tenGodSummary.careerHint}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-400 font-bold mb-1">대인관계</p>
              <p className="text-sm text-gray-300">{tenGodSummary.relationshipHint}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-gray-400 shrink-0">궁합:</span>
              <span className="text-xs text-gray-300">{dm.bestMatch}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-gray-400 shrink-0">조언:</span>
              <span className="text-xs text-yellow-300">{dm.advice}</span>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

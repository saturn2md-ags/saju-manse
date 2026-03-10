'use client';

import { SpecialStar } from '@/types/saju';
import { SPECIAL_STAR_INTERPRETATIONS } from '@/data/interpretations/specialStars';
import { useState } from 'react';

interface SpecialStarsSectionProps {
  stars: SpecialStar[];
}

// 위치 순서: 시주 → 일주 → 월주 → 년주 (전통 배열)
const COLUMN_LABELS = ['시주', '일주', '월주', '년주'];

function getColumnKey(position: string): string {
  if (position.startsWith('시')) return '시주';
  if (position.startsWith('일')) return '일주';
  if (position.startsWith('월')) return '월주';
  if (position.startsWith('년')) return '년주';
  return '기타';
}

// S급: 0~5, A급: 10~19, B급: 20+
function getGradeOpacity(name: string): string {
  const S = ['천을귀인', '태극귀인', '양인살', '괴강살', '역마살', '도화살'];
  const B = ['학당귀인', '문곡귀인', '금여록', '장성살', '반안살', '망신살', '현침살', '천의성'];
  if (S.includes(name)) return '';           // 100%
  if (B.includes(name)) return 'opacity-50'; // 50%
  return 'opacity-75';                       // A급 75%
}

export default function SpecialStarsSection({ stars }: SpecialStarsSectionProps) {
  const [modalStar, setModalStar] = useState<string | null>(null);

  if (stars.length === 0) return null;

  // 기둥별 그루핑
  const byColumn: Record<string, string[]> = { '시주': [], '일주': [], '월주': [], '년주': [] };
  for (const star of stars) {
    const col = getColumnKey(star.position);
    if (byColumn[col] && !byColumn[col].includes(star.name)) {
      byColumn[col].push(star.name);
    }
  }

  const maxRows = Math.max(...Object.values(byColumn).map(arr => arr.length), 0);

  const modalInterp = modalStar ? SPECIAL_STAR_INTERPRETATIONS[modalStar] : null;

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <h2 className="text-lg font-bold text-white mb-1">신살 (神殺)</h2>
      <p className="text-sm text-gray-400 mb-4">신살을 탭하면 해석을 볼 수 있어요</p>

      {/* 테이블 헤더 */}
      <div className="grid grid-cols-4 gap-1 mb-1">
        {COLUMN_LABELS.map(label => (
          <div key={label} className="text-center text-xs font-bold text-gray-500 py-1 bg-gray-800/50 rounded-t">
            {label}
          </div>
        ))}
      </div>

      {/* 테이블 바디 */}
      <div className="bg-gray-800/30 rounded-b overflow-hidden">
        {Array.from({ length: maxRows }).map((_, rowIdx) => (
          <div key={rowIdx} className={`grid grid-cols-4 gap-px ${rowIdx > 0 ? 'border-t border-gray-800/50' : ''}`}>
            {COLUMN_LABELS.map(col => {
              const starName = byColumn[col][rowIdx];
              if (!starName) return <div key={col} className="py-2 px-1" />;

              const interp = SPECIAL_STAR_INTERPRETATIONS[starName];
              const isPositive = interp?.isPositive;

              return (
                <button
                  key={col}
                  onClick={() => setModalStar(starName)}
                  className={`py-2 px-1 text-center text-xs font-medium transition-colors hover:bg-gray-700/50 ${getGradeOpacity(starName)} ${
                    isPositive === true ? 'text-emerald-400' :
                    isPositive === false ? 'text-orange-400' :
                    'text-gray-400'
                  }`}
                >
                  {starName}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex gap-4 mt-3 justify-center">
        <span className="text-xs text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> 길신
        </span>
        <span className="text-xs text-orange-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" /> 흉신
        </span>
      </div>

      {/* 모달 */}
      {modalStar && modalInterp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setModalStar(null)}
        >
          <div
            className={`w-full max-w-sm rounded-2xl p-4 border ${
              modalInterp.isPositive
                ? 'bg-gray-900 border-emerald-800/50'
                : 'bg-gray-900 border-orange-800/50'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{modalInterp.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{modalStar}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    modalInterp.isPositive ? 'bg-emerald-800/50 text-emerald-300' : 'bg-orange-800/50 text-orange-300'
                  }`}>
                    {modalInterp.isPositive ? '길신' : '흉신'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">{modalInterp.keyword}</p>
              </div>
            </div>

            {/* 위치 표시 */}
            <div className="flex gap-1 mb-3">
              {stars.filter(s => s.name === modalStar).map((s, i) => (
                <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                  {s.position}
                </span>
              ))}
            </div>

            {/* 해석 */}
            <p className="text-sm text-gray-300 leading-relaxed mb-2">{modalInterp.shortDesc}</p>
            <p className="text-sm text-gray-400 leading-relaxed">{modalInterp.fullDesc}</p>

            {/* 닫기 */}
            <button
              onClick={() => setModalStar(null)}
              className="mt-4 w-full py-2.5 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-xl transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

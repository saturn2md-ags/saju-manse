'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [gender, setGender] = useState<'남' | '여'>('남');
  const [isLunar, setIsLunar] = useState(false);
  const [isLeapMonth, setIsLeapMonth] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 생년월일 파싱: 숫자만 (YYYYMMDD)
    const dateStr = birthDate.trim();
    if (dateStr.length !== 8) return;
    const year = dateStr.slice(0, 4);
    const month = String(parseInt(dateStr.slice(4, 6)));
    const day = String(parseInt(dateStr.slice(6, 8)));
    if (!year || !month || !day || parseInt(month) < 1 || parseInt(month) > 12 || parseInt(day) < 1 || parseInt(day) > 31) return;

    // 시간 파싱: 숫자만 (HHMM 또는 HMM 또는 HH) 또는 빈값
    let hour = '12';
    let minute = '0';
    const timeStr = birthTime.trim();
    if (timeStr) {
      if (timeStr.length <= 2) {
        hour = String(parseInt(timeStr));
        minute = '0';
      } else if (timeStr.length === 3) {
        hour = String(parseInt(timeStr.slice(0, 1)));
        minute = String(parseInt(timeStr.slice(1, 3)));
      } else if (timeStr.length === 4) {
        hour = String(parseInt(timeStr.slice(0, 2)));
        minute = String(parseInt(timeStr.slice(2, 4)));
      }
    }

    const params = new URLSearchParams({
      year, month, day, hour, minute, gender,
      lunar: isLunar ? '1' : '0',
      leapMonth: isLunar && isLeapMonth ? '1' : '0',
    });

    router.push(`/result?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0D0D14] text-white">
      {/* 헤더 */}
      <div className="pt-12 pb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          만세력 풀이
        </h1>
        <p className="text-gray-400 mt-2 text-sm">당신의 사주를 분석해보세요</p>
      </div>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-6 space-y-6">
        {/* 성별 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">성별</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`py-3 rounded-xl text-center font-bold transition-all ${
                gender === '남'
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              onClick={() => setGender('남')}
            >
              남성
            </button>
            <button
              type="button"
              className={`py-3 rounded-xl text-center font-bold transition-all ${
                gender === '여'
                  ? 'bg-pink-600 text-white ring-2 ring-pink-400'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              onClick={() => setGender('여')}
            >
              여성
            </button>
          </div>
        </div>

        {/* 양력/음력 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">달력 종류</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`py-2 rounded-xl text-center text-sm transition-all ${
                !isLunar
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              onClick={() => { setIsLunar(false); setIsLeapMonth(false); }}
            >
              양력
            </button>
            <button
              type="button"
              className={`py-2 rounded-xl text-center text-sm transition-all ${
                isLunar
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              onClick={() => setIsLunar(true)}
            >
              음력
            </button>
          </div>

          {/* 평달/윤달 - 음력 선택 시에만 표시 */}
          {isLunar && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                className={`py-2 rounded-xl text-center text-sm transition-all ${
                  !isLeapMonth
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                onClick={() => setIsLeapMonth(false)}
              >
                평달
              </button>
              <button
                type="button"
                className={`py-2 rounded-xl text-center text-sm transition-all ${
                  isLeapMonth
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                onClick={() => setIsLeapMonth(true)}
              >
                윤달
              </button>
            </div>
          )}
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">생년월일</label>
          <input
            type="text"
            placeholder="예: 19980308"
            value={birthDate}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '');
              if (v.length <= 8) setBirthDate(v);
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            inputMode="numeric"
          />
        </div>

        {/* 태어난 시간 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            태어난 시간 <span className="text-gray-600">(모르면 비워두세요)</span>
          </label>
          <input
            type="text"
            placeholder="예: 1121"
            value={birthTime}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '');
              if (v.length <= 4) setBirthTime(v);
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            inputMode="numeric"
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-900/50"
        >
          사주 분석하기
        </button>

      </form>

      {/* 설명 */}
      <div className="max-w-md mx-auto px-6 mt-12 pb-12">
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-sm font-bold text-white mb-3">이런 것들을 알 수 있어요</h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-purple-400">●</span> 사주팔자 - 타고난 성격과 운명의 설계도
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-400">●</span> 일간 분석 - 나는 어떤 사람인가?
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-400">●</span> 십성 분석 - 나를 둘러싼 에너지들
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-400">●</span> 오행 밸런스 - 에너지의 균형 상태
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-400">●</span> 대운/세운/월운 - 10년, 1년, 1달의 운세
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-400">●</span> 신살 - 특별한 별들의 영향
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

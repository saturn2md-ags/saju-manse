import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '만세력 풀이 - 사주팔자 분석';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D0D14 0%, #1a1028 50%, #0D0D14 100%)',
          position: 'relative',
        }}
      >
        {/* 배경 장식 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.08,
            fontSize: 300,
          }}
        >
          ☯
        </div>

        {/* 상단 오행 아이콘 */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginBottom: 40,
          }}
        >
          {['木', '火', '土', '金', '水'].map((el, i) => {
            const colors = ['#22c55e', '#ef4444', '#eab308', '#f59e0b', '#3b82f6'];
            return (
              <div
                key={i}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'white',
                  background: colors[i],
                  opacity: 0.85,
                }}
              >
                {el}
              </div>
            );
          })}
        </div>

        {/* 타이틀 */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 800,
            background: 'linear-gradient(90deg, #c084fc, #f472b6, #60a5fa)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 16,
          }}
        >
          만세력 풀이
        </div>

        {/* 서브타이틀 */}
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#9ca3af',
            marginBottom: 48,
          }}
        >
          당신의 사주를 분석해보세요
        </div>

        {/* 태그들 */}
        <div
          style={{
            display: 'flex',
            gap: 16,
          }}
        >
          {['사주팔자', '십성분석', '오행밸런스', '대운', '신살'].map((tag, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                padding: '10px 24px',
                borderRadius: 999,
                fontSize: 20,
                color: '#d1d5db',
                border: '1px solid #374151',
                background: 'rgba(255,255,255,0.05)',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            display: 'flex',
            fontSize: 18,
            color: '#6b7280',
          }}
        >
          saju-manse.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}

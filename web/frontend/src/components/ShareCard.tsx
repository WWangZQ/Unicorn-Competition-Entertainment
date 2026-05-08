import { useRef } from 'react';
import html2canvas from 'html2canvas';
import type { QuizResult } from '../utils/scoring';
import { getModelScores, getModelLabel } from '../utils/scoring';
import { DIMENSIONS } from '../data/dimensions';

interface Props {
  result: QuizResult;
  nickname: string;
}

export default function ShareCard({ result, nickname }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#1a1a1a',
      scale: 2,
    });
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `KGTI_${result.personality?.code ?? result.specialCode}.png`;
    a.click();
  };

  const isSpecial = result.specialCode !== null;
  const modelScores = getModelScores(result.dimensionScores);

  return (
    <div className="share-wrap">
      <div className="share-card" ref={cardRef}>
        <div className="share-card-inner">
          <div className="share-brand">KGTI · 科广TI</div>

          {isSpecial ? (
            <>
              <div className="share-code share-code--special">{result.specialCode}</div>
              <div className="share-name">{result.specialName}</div>
              <div className="share-tagline">{result.specialTagline}</div>
            </>
          ) : result.personality ? (
            <>
              <div className="share-code">{result.personality.code}</div>
              <div className="share-name">{result.personality.name}</div>
              <div className="share-tagline">{result.personality.tagline}</div>
              <div className="share-similarity">
                匹配度 {result.similarity}%
              </div>
            </>
          ) : null}

          <div className="share-models">
            {Object.entries(modelScores).map(([key, score]) => (
              <div key={key} className="share-model-bar">
                <span className="share-model-label">{getModelLabel(key)}</span>
                <div className="share-model-track">
                  <div
                    className="share-model-fill"
                    style={{ width: `${(score / 12) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="share-footer">
            {nickname && <span>{nickname}</span>}
            <span>sbti.ai 风格 · 仅供娱乐</span>
          </div>
        </div>
      </div>

      <button className="btn btn--primary share-btn" onClick={handleExport}>
        保存图片分享
      </button>
    </div>
  );
}

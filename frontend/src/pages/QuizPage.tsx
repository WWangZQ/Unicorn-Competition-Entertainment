import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, hiddenQuestions } from '../data/questions';
import { computeResult } from '../utils/scoring';
import { saveAnswers, saveResult, getNickname } from '../utils/storage';
import { submitResult } from '../utils/api';
import { getDeviceId } from '../utils/identity';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = 'hidden' | 'main' | 'done';

export default function QuizPage() {
  const navigate = useNavigate();
  const shuffledHidden = useMemo(() => shuffle(hiddenQuestions), []);
  const shuffledMain = useMemo(() => shuffle(questions), []);
  const [phase, setPhase] = useState<Phase>('hidden');
  const [hiddenIndex, setHiddenIndex] = useState(0);
  const [mainIndex, setMainIndex] = useState(0);
  const [hiddenAnswers, setHiddenAnswers] = useState<Record<string, number>>({});
  const [mainAnswers, setMainAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [phase, hiddenIndex, mainIndex]);

  const handleHiddenSelect = (index: number) => {
    setSelected(index);
    const q = shuffledHidden[hiddenIndex];
    const newAnswers = { ...hiddenAnswers, [q.id]: index };
    setHiddenAnswers(newAnswers);

    setTimeout(() => {
      if (hiddenIndex < shuffledHidden.length - 1) {
        setHiddenIndex(hiddenIndex + 1);
      } else {
        setPhase('main');
      }
    }, 300);
  };

  const handleMainSelect = (index: number) => {
    setSelected(index);
    const q = shuffledMain[mainIndex];
    const newAnswers = { ...mainAnswers, [q.id]: index };
    setMainAnswers(newAnswers);

    setTimeout(() => {
      if (mainIndex < shuffledMain.length - 1) {
        setMainIndex(mainIndex + 1);
      } else {
        // Done
        const result = computeResult(newAnswers);
        saveAnswers(newAnswers, hiddenAnswers);
        saveResult(result);

        // Submit to backend
        const nickname = getNickname() ?? '匿名';
        const code = result.personality?.code ?? result.specialCode ?? '????';
        const name = result.personality?.name ?? result.specialName ?? '未知';
        submitResult({
          nickname,
          personalityCode: code,
          personalityName: name,
          dimensionScores: result.dimensionScores,
          deviceId: getDeviceId(),
        }).catch(() => {}); // Silently fail if backend not available

        navigate('/result');
      }
    }, 300);
  };

  const currentQuestion =
    phase === 'hidden'
      ? shuffledHidden[hiddenIndex]
      : shuffledMain[mainIndex];

  const totalSteps = shuffledHidden.length + shuffledMain.length;
  const currentStep = phase === 'hidden' ? hiddenIndex + 1 : shuffledHidden.length + mainIndex + 1;

  return (
    <div className="page quiz-page">
      <ProgressBar current={currentStep} total={totalSteps} />

      {phase === 'hidden' && (
        <div className="phase-badge">热身</div>
      )}

      <QuestionCard
        question={currentQuestion}
        selectedIndex={selected}
        onSelect={phase === 'hidden' ? handleHiddenSelect : handleMainSelect}
        isHidden={phase === 'hidden'}
      />

      <div className="quiz-nav">
        {phase === 'main' && mainIndex > 0 && (
          <button
            className="btn btn--ghost"
            onClick={() => {
              setMainIndex(mainIndex - 1);
              setSelected(mainAnswers[shuffledMain[mainIndex - 1]?.id] ?? null);
            }}
          >
            ← 上一题
          </button>
        )}
        <div className="quiz-nav-spacer" />
      </div>
    </div>
  );
}

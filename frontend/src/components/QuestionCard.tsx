import type { Question } from '../data/questions';

interface Props {
  question: Question;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  isHidden?: boolean;
}

export default function QuestionCard({ question, selectedIndex, onSelect, isHidden }: Props) {
  return (
    <div className={`question-card ${isHidden ? 'question-card--hidden' : ''}`}>
      <p className="question-text">{question.text}</p>
      <div className="options">
        {question.options.map((opt, i) => (
          <button
            key={i}
            className={`option-btn ${selectedIndex === i ? 'option-btn--selected' : ''}`}
            onClick={() => onSelect(i)}
          >
            <span className="option-letter">{String.fromCharCode(65 + i)}</span>
            <span className="option-text">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

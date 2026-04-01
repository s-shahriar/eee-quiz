import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronRight, Bookmark, BookmarkCheck, AlertCircle, CheckCircle2, Lightbulb, XCircle } from 'lucide-react'
import Header from './Header'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// SVG countdown ring – 2 second auto-advance indicator
function CountdownRing() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" className="shrink-0">
      <circle cx="18" cy="18" r="16" fill="none" stroke="#1e293b" strokeWidth="3" />
      <circle
        cx="18" cy="18" r="16"
        fill="none"
        stroke="#10b981"
        strokeWidth="3"
        strokeDasharray="100.5"
        strokeDashoffset="100.5"
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
        style={{ animation: 'fillRing 2s linear forwards' }}
      />
    </svg>
  )
}

export default function QuizMode({ topic, onBack, onFinish, isBookmarked, onToggleBookmark }) {
  const [questions] = useState(() => shuffle(topic.data))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState(null)      // option text user picked
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [cardKey, setCardKey] = useState(0)
  const timerRef = useRef(null)

  const current = questions[currentIdx]
  const total = questions.length
  const remaining = total - currentIdx - (answered ? 1 : 0)

  const advance = useCallback(() => {
    clearTimeout(timerRef.current)
    if (currentIdx + 1 >= total) {
      onFinish({ correct, wrong: answered && selected !== current.correct_answer ? wrong : wrong, total })
    } else {
      setCurrentIdx(i => i + 1)
      setSelected(null)
      setAnswered(false)
      setCardKey(k => k + 1)
    }
  }, [currentIdx, total, correct, wrong, answered, selected, current, onFinish])

  // When user picks an answer
  const pick = useCallback((opt) => {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
    const isCorrect = opt === current.correct_answer
    if (isCorrect) {
      setCorrect(c => c + 1)
      // auto-advance after 2s
      timerRef.current = setTimeout(() => {
        setCurrentIdx(i => {
          const next = i + 1
          if (next >= total) {
            onFinish({ correct: correct + 1, wrong, total })
            return i
          }
          return next
        })
        setSelected(null)
        setAnswered(false)
        setCardKey(k => k + 1)
      }, 2000)
    } else {
      setWrong(w => w + 1)
    }
  }, [answered, current, correct, wrong, total, onFinish])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const isCorrectAnswer = answered && selected === current.correct_answer
  const isWrongAnswer = answered && selected !== current.correct_answer

  // Finish if all answered
  if (!current) return null

  return (
    <div className="min-h-screen bg-slate-900">
      <Header
        title={topic.title}
        onBack={onBack}
        progress
        current={currentIdx + (answered ? 1 : 0)}
        total={total}
        correct={correct}
        wrong={wrong}
      />

      <style>{`
        @keyframes fillRing {
          from { stroke-dashoffset: 100.5; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div key={cardKey} className="card-enter">
          {/* Question card */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 mb-4">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-start gap-3 flex-1">
                <span
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: topic.accent + 'cc' }}
                >
                  {currentIdx + 1}
                </span>
                <p className="text-white text-base leading-relaxed">{current.question}</p>
              </div>
              <button
                onClick={() => onToggleBookmark(current.id)}
                className="shrink-0 p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
              >
                {isBookmarked(current.id)
                  ? <BookmarkCheck size={16} className="text-amber-400" />
                  : <Bookmark size={16} className="text-slate-500" />
                }
              </button>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {current.options.map((opt, i) => {
                const isCorrect = opt === current.correct_answer
                const isPicked = opt === selected

                let cls = 'bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 cursor-pointer'
                if (answered) {
                  if (isCorrect) cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-200 cursor-default'
                  else if (isPicked) cls = 'bg-red-500/15 border-red-500 text-red-200 cursor-default'
                  else cls = 'bg-slate-700/30 border-slate-700 text-slate-500 cursor-default'
                }

                return (
                  <button
                    key={i}
                    onClick={() => pick(opt)}
                    disabled={answered}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm border transition-all text-left ${cls}`}
                  >
                    <span
                      className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                        answered && isCorrect ? 'bg-emerald-500 text-white'
                        : answered && isPicked ? 'bg-red-500 text-white'
                        : 'bg-slate-600 text-slate-300'
                      }`}
                    >
                      {LETTERS[i]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {answered && isCorrect && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
                    {answered && isPicked && !isCorrect && <AlertCircle size={16} className="text-red-400 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Explanation + Next */}
          {answered && (
            <div className="slide-in flex flex-col gap-3">
              {/* Explanation */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
                <p className="text-xs font-semibold text-sky-400 mb-2 flex items-center gap-1.5"><Lightbulb size={13} /> ব্যাখ্যা</p>
                <p className="text-slate-300 text-sm leading-relaxed">{current.explanation_bn}</p>
              </div>

              {/* Why others are wrong */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
                <p className="text-xs font-semibold text-rose-400 mb-3 flex items-center gap-1.5"><XCircle size={13} /> কেন অন্য উত্তরগুলো ভুল</p>
                <div className="flex flex-col gap-2">
                  {current.options
                    .filter(opt => opt !== current.correct_answer)
                    .map((opt, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <XCircle size={14} className="shrink-0 text-rose-500 mt-0.5" />
                        <span className="text-slate-400">{opt}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Next button or auto-advance indicator */}
              {isCorrectAnswer ? (
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-3">
                  <CountdownRing />
                  <span className="text-emerald-400 text-sm font-medium">সঠিক! পরের প্রশ্নে যাচ্ছি...</span>
                </div>
              ) : (
                <button
                  onClick={advance}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: topic.accent }}
                >
                  পরবর্তী প্রশ্ন <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { RotateCcw, BookOpen, Home, Trophy, Target, Dumbbell } from 'lucide-react'
import Header from './Header'

function getScoreInfo(pct) {
  if (pct >= 90) return { Icon: Trophy,   color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', label: 'অসাধারণ!' }
  if (pct >= 70) return { Icon: Target,   color: 'text-sky-400',    bg: 'bg-sky-400/10',    border: 'border-sky-400/30',    label: 'ভালো করেছ!' }
  if (pct >= 50) return { Icon: BookOpen, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/30', label: 'আরো পড়তে হবে' }
  return         { Icon: Dumbbell,        color: 'text-rose-400',   bg: 'bg-rose-400/10',   border: 'border-rose-400/30',   label: 'আরো প্র্যাকটিস করো' }
}

export default function Results({ topic, correct, wrong, total, onRetry, onRevise, onHome }) {
  const pct = Math.round((correct / total) * 100)
  const { Icon, color, bg, border, label } = getScoreInfo(pct)

  return (
    <div className="min-h-screen bg-slate-900">
      <Header title="ফলাফল" onBack={onHome} />

      <div className="max-w-md mx-auto px-4 py-10">
        {/* Score ring */}
        <div className="flex flex-col items-center mb-8">
          <div className={`w-32 h-32 rounded-full ${bg} border-2 ${border} flex flex-col items-center justify-center mb-4 score-pop`}>
            <Icon size={28} className={color} />
            <span className={`text-3xl font-bold ${color} mt-1`}>{pct}%</span>
          </div>
          <h2 className="text-white text-xl font-bold">{label}</h2>
          <p className="text-slate-400 text-sm mt-1">{topic.title}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{correct}</p>
            <p className="text-xs text-slate-400 mt-1">সঠিক</p>
          </div>
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{wrong}</p>
            <p className="text-xs text-slate-400 mt-1">ভুল</p>
          </div>
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 text-center">
            <p className="text-2xl font-bold text-slate-300">{total}</p>
            <p className="text-xs text-slate-400 mt-1">মোট</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: topic.accent }}
          >
            <RotateCcw size={15} />
            আবার চেষ্টা করো
          </button>
          <button
            onClick={onRevise}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white bg-slate-700 hover:bg-slate-600 transition-all active:scale-95"
          >
            <BookOpen size={15} />
            Revise Topic
          </button>
          <button
            onClick={onHome}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <Home size={15} />
            সব টপিক
          </button>
        </div>
      </div>
    </div>
  )
}

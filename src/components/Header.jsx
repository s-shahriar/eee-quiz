import { ArrowLeft, BookOpen } from 'lucide-react'

export default function Header({ title, onBack, progress, current, total, correct, wrong }) {
  const pct = total ? Math.round((current / total) * 100) : 0

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700/60">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {!onBack && (
          <div className="flex items-center gap-2 text-slate-200">
            <BookOpen size={20} className="text-sky-400" />
            <span className="font-semibold text-sm">EEE Quiz</span>
          </div>
        )}

        <span className="flex-1 text-sm font-medium text-slate-200 truncate">{title}</span>

        {total > 0 && (
          <span className="text-xs font-mono text-slate-400 shrink-0">
            {current} / {total}
          </span>
        )}

        {correct !== undefined && (
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="text-green-400 font-semibold">{correct} ✓</span>
            <span className="text-red-400 font-semibold">{wrong} ✗</span>
            <span className="text-slate-400">{total - current} left</span>
          </div>
        )}
      </div>

      {progress && (
        <div className="h-0.5 bg-slate-700">
          <div
            className="h-full bg-sky-500 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </header>
  )
}

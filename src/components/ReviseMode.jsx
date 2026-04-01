import { useState, useMemo } from 'react'
import { Search, Bookmark, BookmarkCheck, X, Lightbulb } from 'lucide-react'
import Header from './Header'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function normalize(str) {
  return str.toLowerCase().trim()
}

export default function ReviseMode({ topic, onBack, isBookmarked, onToggleBookmark }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return topic.data
    const q = normalize(query)
    return topic.data.filter(item =>
      normalize(item.question).includes(q) ||
      item.options.some(o => normalize(o).includes(q)) ||
      normalize(item.explanation_bn).includes(q)
    )
  }, [query, topic.data])

  return (
    <div className="min-h-screen bg-slate-900">
      <Header title={topic.title} onBack={onBack} />

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Search bar */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="প্রশ্ন, অপশন বা ব্যাখ্যায় খুঁজুন..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Counter */}
        <p className="text-xs text-slate-400 mb-4 font-mono">
          {filtered.length} / {topic.data.length} questions
          {query && <span className="ml-1 text-sky-400">for "{query}"</span>}
        </p>

        {/* Questions */}
        <div className="flex flex-col gap-4">
          {filtered.map((item, idx) => (
            <QuestionCard
              key={item.id}
              item={item}
              num={idx + 1}
              accent={topic.accent}
              bookmarked={isBookmarked(item.id)}
              onBookmark={() => onToggleBookmark(item.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Search size={32} className="mx-auto mb-3 opacity-40" />
              <p>কোনো প্রশ্ন পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuestionCard({ item, num, accent, bookmarked, onBookmark }) {
  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 fade-in">
      {/* Question header */}
      <div className="flex items-start gap-3 mb-4">
        <span
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
          style={{ background: accent + 'cc' }}
        >
          {num}
        </span>
        <p className="text-white text-sm leading-relaxed flex-1">{item.question}</p>
        <button
          onClick={onBookmark}
          className="shrink-0 p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
          title="Bookmark"
        >
          {bookmarked
            ? <BookmarkCheck size={16} className="text-amber-400" />
            : <Bookmark size={16} className="text-slate-500" />
          }
        </button>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2 mb-4">
        {item.options.map((opt, i) => {
          const isCorrect = opt === item.correct_answer
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm border transition-colors ${
                isCorrect
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-700/50 border-slate-600/50 text-slate-300'
              }`}
            >
              <span
                className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                  isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-300'
                }`}
              >
                {LETTERS[i]}
              </span>
              <span>{opt}</span>
              {isCorrect && (
                <span className="ml-auto text-xs font-semibold text-emerald-400">✓ সঠিক</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Bengali explanation */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-700/60 p-3">
        <p className="text-xs font-semibold text-sky-400 mb-1.5 flex items-center gap-1.5">
          <Lightbulb size={13} /> ব্যাখ্যা
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">{item.explanation_bn}</p>
      </div>
    </div>
  )
}

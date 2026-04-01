import { useState, useMemo, useEffect } from 'react'
import { Search, Bookmark, BookmarkCheck, X, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react'
import Header from './Header'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const PAGE_SIZE = 20

function normalize(str) {
  return str.toLowerCase().trim()
}

export default function ReviseMode({ topic, onBack, isBookmarked, onToggleBookmark }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!query.trim()) return topic.data
    const q = normalize(query)
    return topic.data.filter(item =>
      normalize(item.question).includes(q) ||
      item.options.some(o => normalize(o).includes(q)) ||
      normalize(item.explanation_bn).includes(q)
    )
  }, [query, topic.data])

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1) }, [query])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const startNum = (page - 1) * PAGE_SIZE + 1

  function goTo(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header title={topic.title} onBack={onBack} />

      {/* Sticky toolbar: search + pagination */}
      <div className="sticky top-14 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700/60">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="প্রশ্ন, অপশন বা ব্যাখ্যায় খুঁজুন..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-9 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onGoTo={goTo} accent={topic.accent} />
          )}
        </div>

        {/* Counter row */}
        <div className="max-w-3xl mx-auto px-4 pb-2 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-mono">
            {filtered.length} / {topic.data.length} questions
            {query && <span className="ml-1 text-sky-400">"{query}"</span>}
          </p>
          {totalPages > 1 && (
            <p className="text-xs text-slate-500 font-mono">Page {page} / {totalPages}</p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {pageItems.map((item, idx) => (
            <QuestionCard
              key={item.id}
              item={item}
              num={startNum + idx}
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

function Pagination({ page, totalPages, onGoTo, accent }) {
  function getPages() {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={() => onGoTo(page - 1)}
        disabled={page === 1}
        className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} />
      </button>

      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`e${i}`} className="w-6 text-center text-slate-500 text-xs">…</span>
          : <button
              key={p}
              onClick={() => onGoTo(p)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-all border"
              style={
                p === page
                  ? { background: accent, borderColor: accent, color: '#fff' }
                  : { background: 'transparent', borderColor: '#334155', color: '#94a3b8' }
              }
            >
              {p}
            </button>
      )}

      <button
        onClick={() => onGoTo(page + 1)}
        disabled={page === totalPages}
        className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={14} />
      </button>
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

import { BookOpen, Play, Bookmark } from 'lucide-react'
import { TOPICS } from '../data/topics'
import Header from './Header'

export default function Home({ onSelectTopic, bookmarkCount }) {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header title="" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">EEE Quiz</h1>
          <p className="text-slate-400 text-sm">বিষয় ভিত্তিক MCQ প্র্যাকটিস</p>
          {bookmarkCount > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full">
              <Bookmark size={12} />
              {bookmarkCount} bookmarked
            </div>
          )}
        </div>

        {/* Topic cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOPICS.map((topic) => {
            const { Icon } = topic
            return (
              <div
                key={topic.id}
                className={`rounded-2xl border ${topic.border} ${topic.bg} p-5 flex flex-col gap-4`}
              >
                {/* Topic header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: topic.accent + '22' }}
                  >
                    <Icon size={20} style={{ color: topic.accent }} />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-sm leading-tight">{topic.title}</h2>
                    <p className="text-slate-400 text-xs mt-0.5">{topic.title_bn}</p>
                  </div>
                  <span className="ml-auto text-xs text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded-md">
                    {topic.data.length}Q
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectTopic(topic, 'quiz')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: topic.accent }}
                  >
                    <Play size={14} />
                    Quiz
                  </button>
                  <button
                    onClick={() => onSelectTopic(topic, 'revise')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 bg-slate-700 text-slate-200 hover:bg-slate-600"
                  >
                    <BookOpen size={14} />
                    Revise
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

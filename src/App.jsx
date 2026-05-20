import { useState } from 'react'
import './index.css'
import Home from './components/Home'
import QuizMode from './components/QuizMode'
import ReviseMode from './components/ReviseMode'
import Results from './components/Results'
import { useBookmarks } from './hooks/useBookmarks'
import { TOPICS } from './data/topics'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeTopic, setActiveTopic] = useState(null)
  const [quizResult, setQuizResult] = useState(null)
  const { bookmarks, toggle, isBookmarked } = useBookmarks()

  const bookmarkCount = Object.keys(bookmarks).length

  function selectTopic(topic, mode) {
    setActiveTopic(topic)
    setScreen(mode)
  }

  function handleQuizFinish(result) {
    setQuizResult(result)
    setScreen('results')
  }

  function goHome() {
    setScreen('home')
    setActiveTopic(null)
    setQuizResult(null)
  }

  return (
    <>
      {/* Animated aurora background — home screen only */}
      {screen === 'home' && (
        <div className="aurora-canvas" aria-hidden="true">
          <div className="aurora-blob" />
          <div className="aurora-grid" />
        </div>
      )}

      <div className="relative z-10">
        {screen === 'quiz' && activeTopic && (
          <QuizMode
            key={activeTopic.id + '_quiz'}
            topic={activeTopic}
            onBack={goHome}
            onFinish={handleQuizFinish}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggle}
          />
        )}
        {screen === 'revise' && activeTopic && (
          <ReviseMode
            key={activeTopic.id + '_revise'}
            topic={activeTopic}
            topics={TOPICS}
            onBack={goHome}
            onChangeTopic={(t) => setActiveTopic(t)}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggle}
          />
        )}
        {screen === 'results' && activeTopic && quizResult && (
          <Results
            topic={activeTopic}
            correct={quizResult.correct}
            wrong={quizResult.wrong}
            total={quizResult.total}
            onRetry={() => selectTopic(activeTopic, 'quiz')}
            onRevise={() => selectTopic(activeTopic, 'revise')}
            onHome={goHome}
          />
        )}
        {screen === 'home' && (
          <Home
            onSelectTopic={selectTopic}
            bookmarkCount={bookmarkCount}
          />
        )}
      </div>
    </>
  )
}

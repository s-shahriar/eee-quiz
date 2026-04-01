import { useState } from 'react'
import './index.css'
import Home from './components/Home'
import QuizMode from './components/QuizMode'
import ReviseMode from './components/ReviseMode'
import Results from './components/Results'
import { useBookmarks } from './hooks/useBookmarks'

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

  if (screen === 'quiz' && activeTopic) {
    return (
      <QuizMode
        key={activeTopic.id + '_quiz'}
        topic={activeTopic}
        onBack={goHome}
        onFinish={handleQuizFinish}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggle}
      />
    )
  }

  if (screen === 'revise' && activeTopic) {
    return (
      <ReviseMode
        key={activeTopic.id + '_revise'}
        topic={activeTopic}
        onBack={goHome}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggle}
      />
    )
  }

  if (screen === 'results' && activeTopic && quizResult) {
    return (
      <Results
        topic={activeTopic}
        correct={quizResult.correct}
        wrong={quizResult.wrong}
        total={quizResult.total}
        onRetry={() => selectTopic(activeTopic, 'quiz')}
        onRevise={() => selectTopic(activeTopic, 'revise')}
        onHome={goHome}
      />
    )
  }

  return (
    <Home
      onSelectTopic={selectTopic}
      bookmarkCount={bookmarkCount}
    />
  )
}

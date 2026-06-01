'use client'

import { useReducer } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Lang, Cocktail } from '@/types'
import { cocktails } from '@/data/cocktails'
import { quizTree, TOTAL_STEPS } from '@/data/quiz-tree'
import { ui } from '@/lib/i18n'

// ── State machine ─────────────────────────────────────────────────────

type Stage = 'welcome' | 'quiz' | 'result'

interface State {
  stage: Stage
  lang: Lang
  nodeId: string
  result: Cocktail | null
  stepNum: number
}

type Action =
  | { type: 'SET_LANG'; lang: Lang }
  | { type: 'START' }
  | { type: 'SELECT'; next: string | { result: string } }
  | { type: 'RESTART' }

const initial: State = {
  stage: 'welcome',
  lang: 'en',
  nodeId: 'q1',
  result: null,
  stepNum: 1,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LANG':
      return { ...state, lang: action.lang }
    case 'START':
      return { ...state, stage: 'quiz', nodeId: 'q1', stepNum: 1 }
    case 'SELECT':
      if (typeof action.next === 'string') {
        return { ...state, nodeId: action.next, stepNum: state.stepNum + 1 }
      }
      return {
        ...state,
        stage: 'result',
        result: cocktails[action.next.result] ?? null,
      }
    case 'RESTART':
      return { ...initial, lang: state.lang }
    default:
      return state
  }
}

// ── Animation variant ─────────────────────────────────────────────────

const fadeUp = {
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
}

// ── Component ─────────────────────────────────────────────────────────

export function QuizEngine() {
  const [state, dispatch] = useReducer(reducer, initial)
  const { stage, lang, nodeId, result, stepNum } = state
  const t  = ui[lang]
  const node = quizTree[nodeId]

  return (
    <div className="quiz-root">
      <div className="ambient" />

      <AnimatePresence mode="wait">

        {/* ── Welcome ── */}
        {stage === 'welcome' && (
          <motion.div key="welcome" {...fadeUp} className="screen">
            <span className="logo-mark">🍸</span>
            <h1 className="brand">
              Match <em className="brand-em">&apos;n&apos;</em> Taste
            </h1>
            <p className="tagline">{t.tagline}</p>
            <div className="divider" />
            <p className="welcome-text">{t.welcome}</p>

            <div className="lang-row">
              {(['en', 'gr'] as Lang[]).map((l) => (
                <button
                  key={l}
                  className={`lang-btn${lang === l ? ' lang-btn--active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_LANG', lang: l })}
                >
                  {l === 'en' ? 'EN' : 'ΕΛ'}
                </button>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={() => dispatch({ type: 'START' })}
            >
              {t.start}
            </button>
          </motion.div>
        )}

        {/* ── Quiz ── */}
        {stage === 'quiz' && node && (
          <motion.div key={nodeId} {...fadeUp} className="screen">
            <div className="quiz-header">
              <span className="step-label">{t.step} {stepNum}</span>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min((stepNum / TOTAL_STEPS) * 100, 100)}%` }}
                />
              </div>
              <span className="step-label">{stepNum}/{TOTAL_STEPS}</span>
            </div>

            <p className="question-tag">{node.tag[lang]}</p>
            <h2 className="question-text">{node.question[lang]}</h2>

            <div className={`options-grid${node.options.length <= 2 ? ' options-grid--single' : ''}`}>
              {node.options.map((opt, i) => (
                <button
                  key={i}
                  className="option-btn"
                  onClick={() => dispatch({ type: 'SELECT', next: opt.next })}
                >
                  <span className="option-emoji">{opt.emoji}</span>
                  <span className="option-label">{opt.label[lang]}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Result ── */}
        {stage === 'result' && result && (
          <motion.div key="result" {...fadeUp} className="screen result-screen">
            <p className="result-tag">{t.yourMatch}</p>
            <span className="cocktail-glass">{result.glass}</span>
            <h2 className="cocktail-name">{result.name}</h2>
            <p className="cocktail-sub">{result.subtitle[lang]}</p>
            <div className="divider-sm" />
            <p className="cocktail-desc">{result.description[lang]}</p>

            <div className="ingredients-list">
              {result.ingredients.map((ing, i) => (
                <span key={i} className="ingredient-pill">{ing}</span>
              ))}
            </div>

            <button
              className="btn-ghost"
              onClick={() => dispatch({ type: 'RESTART' })}
            >
              {t.restart}
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      <p className="nomad-footer">Nomad · Match &apos;n&apos; Taste</p>
    </div>
  )
}

'use client'

import { useReducer, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Lang, Cocktail, QuizNode, QuizOption, RuntimeTree, CocktailMap } from '@/types'
import { getQuizTree, getCocktails } from '@/lib/queries'
import { ui } from '@/lib/i18n'

// ── State machine ─────────────────────────────────────────────────────

type Stage = 'welcome' | 'quiz' | 'result'

interface State {
  stage:   Stage
  lang:    Lang
  nodeId:  string
  result:  Cocktail | null
  stepNum: number
  history: string[]
}

type Action =
  | { type: 'SET_LANG'; lang: Lang }
  | { type: 'START' }
  | { type: 'SELECT'; next: string | { result: string } }
  | { type: 'BACK' }
  | { type: 'RESTART' }

const initial: State = {
  stage:   'welcome',
  lang:    'en',
  nodeId:  'q1',
  result:  null,
  stepNum: 1,
  history: [],
}

function makeReducer(cocktails: CocktailMap) {
  return function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'SET_LANG':
        return { ...state, lang: action.lang }
      case 'START':
        return { ...state, stage: 'quiz', nodeId: 'q1', stepNum: 1, history: [] }
      case 'SELECT':
        if (typeof action.next === 'string') {
          return {
            ...state,
            nodeId:  action.next,
            stepNum: state.stepNum + 1,
            history: [...state.history, state.nodeId],
          }
        }
        return {
          ...state,
          stage:   'result',
          result:  cocktails[action.next.result] ?? null,
          history: [...state.history, state.nodeId],
        }
      case 'BACK': {
        if (state.history.length === 0) {
          return { ...initial, lang: state.lang }
        }
        const prev    = state.history[state.history.length - 1]
        const history = state.history.slice(0, -1)
        return {
          ...state,
          stage:   'quiz',
          nodeId:  prev,
          stepNum: state.stepNum - 1,
          result:  null,
          history,
        }
      }
      case 'RESTART':
        return { ...initial, lang: state.lang }
      default:
        return state
    }
  }
}

// ── Animation variant ─────────────────────────────────────────────────

const fadeUp = {
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
}

// ── Build runtime tree from flat DB rows ──────────────────────────────

function buildTree(nodes: QuizNode[], options: QuizOption[]): RuntimeTree {
  const tree: RuntimeTree = {}

  for (const node of nodes) {
    tree[node.id] = {
      tag:      { en: node.tag_en,      gr: node.tag_gr },
      question: { en: node.question_en, gr: node.question_gr },
      options:  [],
    }
  }

  for (const opt of options) {
    const node = tree[opt.node_id]
    if (!node) continue
    node.options.push({
      label: { en: opt.label_en, gr: opt.label_gr },
      emoji: opt.emoji ?? '',
      next:  opt.next_node_id
        ? opt.next_node_id
        : { result: opt.next_cocktail_id! },
    })
  }

  return tree
}

// ── Component ─────────────────────────────────────────────────────────

export function QuizEngine() {
  const [tree, setTree]             = useState<RuntimeTree | null>(null)
  const [cocktails, setCocktails]   = useState<CocktailMap | null>(null)
  const [totalSteps, setTotalSteps] = useState(3)
  const [loadError, setLoadError]   = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [{ nodes, options }, cocktailList] = await Promise.all([
          getQuizTree(),
          getCocktails(),
        ])

        const cocktailMap: CocktailMap = {}
        for (const c of cocktailList) cocktailMap[c.id] = c

        setTree(buildTree(nodes, options))
        setCocktails(cocktailMap)
        setTotalSteps(nodes.length)
      } catch (err) {
        console.error(err)
        setLoadError('Could not load quiz data. Please try again.')
      }
    }
    load()
  }, [])

  const [state, dispatch] = useReducer(
    makeReducer(cocktails ?? {}),
    initial
  )

  const { stage, lang, nodeId, result, stepNum, history } = state
  const t    = ui[lang]
  const node = tree?.[nodeId]

  // ── Loading / error screens ───────────────────────────────────────

  if (loadError) {
    return (
      <div className="quiz-root">
        <div className="ambient" />
        <div className="screen" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--gold)', marginBottom: '1rem' }}>⚠️</p>
          <p className="tagline">{loadError}</p>
        </div>
      </div>
    )
  }

  if (!tree || !cocktails) {
    return (
      <div className="quiz-root">
        <div className="ambient" />
        <div className="screen" style={{ textAlign: 'center' }}>
          <p className="tagline" style={{ color: 'var(--gold-light)' }}>Loading…</p>
        </div>
      </div>
    )
  }

  // ── Main render ───────────────────────────────────────────────────

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
                  style={{ width: `${Math.min((stepNum / totalSteps) * 100, 100)}%` }}
                />
              </div>
              <span className="step-label">{stepNum}/{totalSteps}</span>
            </div>

            <p className="question-tag">{node.tag[lang]}</p>
            <h2 className="question-text">{node.question[lang]}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              {node.options.map((opt, i) => (
                <button
                  key={i}
                  className="option-btn"
                  onClick={() => dispatch({ type: 'SELECT', next: opt.next })}
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', textAlign: 'left' }}
                >
                  <span className="option-emoji">{opt.emoji}</span>
                  <span className="option-label">{opt.label[lang]}</span>
                </button>
              ))}
            </div>

            {/* ── Navigation buttons ── */}
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
              <button
                className="btn-ghost"
                style={{ flex: 1 }}
                onClick={() => dispatch({ type: 'BACK' })}
              >
                ← {history.length === 0 ? t.home : t.back}              </button>
              <button
                className="btn-ghost"
                style={{ flex: 1 }}
                onClick={() => dispatch({ type: 'RESTART' })}
              >
                {t.restart}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Result ── */}
        {stage === 'result' && result && (
          <motion.div key="result" {...fadeUp} className="screen result-screen">
            <p className="result-tag">{t.yourMatch}</p>
            <h2 className="cocktail-name">{result.name}</h2>
            <span className="cocktail-glass">{result.glass}</span>
            <p className="cocktail-sub">{lang === 'en' ? result.subtitle_en : result.subtitle_gr}</p>
            <div className="divider-sm" />
            <p className="cocktail-desc">{lang === 'en' ? result.description_en : result.description_gr}</p>

            <div className="ingredients-list">
              {result.ingredients.map((ing, i) => (
                <span key={i} className="ingredient-pill">{ing}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
              <button
                className="btn-ghost"
                style={{ flex: 1 }}
                onClick={() => dispatch({ type: 'BACK' })}
              >
                ← {t.back}
              </button>
              <button
                className="btn-ghost"
                style={{ flex: 1 }}
                onClick={() => dispatch({ type: 'RESTART' })}
              >
                {t.restart}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <p className="footer">Match &apos;n&apos; Taste</p>
    </div>
  )
}
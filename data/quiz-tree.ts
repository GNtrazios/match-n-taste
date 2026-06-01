import type { QuizTree } from '@/types'

// Maximum depth of any path through the tree (used for progress bar)
export const TOTAL_STEPS = 3

export const quizTree: QuizTree = {
  // ── Question 1: Mood ──────────────────────────────────────────────
  q1: {
    id: 'q1',
    tag: { en: 'Mood', gr: 'Διάθεση' },
    question: { en: 'What mood are you in tonight?', gr: 'Σε τι διάθεση είσαι απόψε;' },
    options: [
      {
        label: { en: 'Refreshed & light', gr: 'Δροσερός & ελαφρύς' },
        emoji: '🌿',
        next: 'q2a',
      },
      {
        label: { en: 'Bold & adventurous', gr: 'Τολμηρός & περιπετειώδης' },
        emoji: '🔥',
        next: 'q2b',
      },
      {
        label: { en: 'Elegant & slow', gr: 'Κομψός & χαλαρός' },
        emoji: '🌙',
        next: 'q2c',
      },
      {
        label: { en: 'Fun & social', gr: 'Διασκεδαστικός & κοινωνικός' },
        emoji: '✨',
        next: 'q2d',
      },
    ],
  },

  // ── Question 2A: Spirit (refreshed path) ──────────────────────────
  q2a: {
    id: 'q2a',
    tag: { en: 'Spirit', gr: 'Βάση' },
    question: { en: 'Which base spirit calls to you?', gr: 'Ποια βάση σε τραβάει;' },
    options: [
      {
        label: { en: 'Rum', gr: 'Ρούμι' },
        emoji: '🌴',
        next: { result: 'mojito' },
      },
      {
        label: { en: 'Gin', gr: 'Gin' },
        emoji: '🌿',
        next: { result: 'ginTonic' },
      },
      {
        label: { en: 'Vodka', gr: 'Βότκα' },
        emoji: '❄️',
        next: 'q3_vodka',
      },
      {
        label: { en: 'Tequila', gr: 'Tequila' },
        emoji: '🌵',
        next: { result: 'palomaRose' },
      },
    ],
  },

  // ── Question 3 (vodka branch): Flavour ────────────────────────────
  q3_vodka: {
    id: 'q3_vodka',
    tag: { en: 'Flavour', gr: 'Γεύση' },
    question: { en: 'What kind of flavour profile?', gr: 'Τι γευστικό προφίλ;' },
    options: [
      {
        label: { en: 'Citrusy & tart', gr: 'Εσπεριδοειδή & ξινό' },
        emoji: '🍋',
        next: { result: 'daiquiri' },
      },
      {
        label: { en: 'Fruity & stylish', gr: 'Φρουτένιο & σικ' },
        emoji: '🍒',
        next: { result: 'cosmopolitan' },
      },
    ],
  },

  // ── Question 2B: Intensity (bold path) ────────────────────────────
  q2b: {
    id: 'q2b',
    tag: { en: 'Intensity', gr: 'Ένταση' },
    question: { en: 'How intense do you want it?', gr: 'Πόσο έντονο θες;' },
    options: [
      {
        label: { en: 'Very intense — neat spirit vibes', gr: 'Πολύ έντονο' },
        emoji: '🥃',
        next: { result: 'oldFashioned' },
      },
      {
        label: { en: 'Bold but balanced', gr: 'Έντονο αλλά ισορροπημένο' },
        emoji: '🍸',
        next: { result: 'negroni' },
      },
      {
        label: { en: 'Tangy & punchy', gr: 'Ξινό & δυνατό' },
        emoji: '🍋',
        next: { result: 'margarita' },
      },
      {
        label: { en: 'Dark with a kick', gr: 'Σκούρο με πάθος' },
        emoji: '☕',
        next: { result: 'espressoMartini' },
      },
    ],
  },

  // ── Question 2C: Style (elegant path) ─────────────────────────────
  q2c: {
    id: 'q2c',
    tag: { en: 'Style', gr: 'Στυλ' },
    question: { en: 'What style of elegant?', gr: 'Τι στυλ κομψότητας;' },
    options: [
      {
        label: { en: 'Classic & storied', gr: 'Κλασικό & με ιστορία' },
        emoji: '📜',
        next: { result: 'oldFashioned' },
      },
      {
        label: { en: 'Herbal & complex', gr: 'Βοτανικό & σύνθετο' },
        emoji: '🌿',
        next: { result: 'negroni' },
      },
      {
        label: { en: 'Floral & delicate', gr: 'Ανθικό & λεπτό' },
        emoji: '🌸',
        next: { result: 'palomaRose' },
      },
      {
        label: { en: 'Clean & sharp', gr: 'Καθαρό & κοφτό' },
        emoji: '❄️',
        next: { result: 'daiquiri' },
      },
    ],
  },

  // ── Question 2D: Vibe (social path) ───────────────────────────────
  q2d: {
    id: 'q2d',
    tag: { en: 'Vibe', gr: 'Βάιμπ' },
    question: { en: "What's the vibe of the evening?", gr: 'Τι βάιμπ έχει η βραδιά;' },
    options: [
      {
        label: { en: 'Aperitivo hour', gr: 'Ώρα aperitivo' },
        emoji: '🍊',
        next: { result: 'aperolSpritz' },
      },
      {
        label: { en: 'Party just started', gr: 'Αρχίσαμε μόλις' },
        emoji: '🎉',
        next: { result: 'margarita' },
      },
      {
        label: { en: 'Late night dancing', gr: 'Χορός μέχρι πρωί' },
        emoji: '🌃',
        next: { result: 'espressoMartini' },
      },
      {
        label: { en: 'Chill & chatty', gr: 'Χαλαρά & κουβεντολόι' },
        emoji: '💬',
        next: { result: 'mojito' },
      },
    ],
  },
}

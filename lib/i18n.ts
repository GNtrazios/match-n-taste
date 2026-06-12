import type { Lang } from '@/types'

interface UIStrings {
  tagline: string
  welcome: string
  start: string
  yourMatch: string
  restart: string
  back: string
}

export const ui: Record<Lang, UIStrings> = {
  en: {
    tagline: 'Find your perfect cocktail',
    welcome: "Answer a few questions and we'll craft the perfect cocktail recommendation just for you.",
    start: 'Begin',
    yourMatch: 'Your perfect match',
    restart: 'Home',
    back: 'Back',
  },
  gr: {
    tagline: 'Βρες το τέλειο κοκτέιλ σου',
    welcome: 'Απάντησε μερικές ερωτήσεις και θα σου προτείνουμε το κοκτέιλ που σου ταιριάζει.',
    start: 'Ξεκίνα',
    yourMatch: 'Η τέλεια πρότασή σου',
    restart: 'Αρχική',
    back: 'Πίσω',
  },
}
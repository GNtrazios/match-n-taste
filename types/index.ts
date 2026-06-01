export type Lang = 'en' | 'gr'

export interface Cocktail {
  id: string
  name: string
  glass: string
  subtitle: Record<Lang, string>
  description: Record<Lang, string>
  ingredients: string[]
}

export interface QuizOption {
  label: Record<Lang, string>
  emoji: string
  next: string | { result: string }
}

export interface QuizNode {
  id: string
  tag: Record<Lang, string>
  question: Record<Lang, string>
  options: QuizOption[]
}

export type QuizTree = Record<string, QuizNode>
export type CocktailMap = Record<string, Cocktail>

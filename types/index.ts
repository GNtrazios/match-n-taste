export type Lang = 'en' | 'gr'

// ── DB row shapes (match Supabase column names exactly) ───────────────

export interface Cocktail {
  id:             string
  name:           string
  glass:          string
  subtitle_en:    string
  subtitle_gr:    string
  description_en: string
  description_gr: string
  ingredients:    string[]
  image_url?:     string
}

export interface QuizNode {
  id:          string
  tag_en:      string
  tag_gr:      string
  question_en: string
  question_gr: string
  order_index: number
}

export interface QuizOption {
  id:               string
  node_id:          string
  label_en:         string
  label_gr:         string
  emoji:            string
  next_node_id:     string | null
  next_cocktail_id: string | null
  order_index:      number
}

// ── Runtime shapes (used inside QuizEngine) ───────────────────────────

export interface RuntimeOption {
  label: Record<Lang, string>
  emoji: string
  next:  string | { result: string }
}

export interface RuntimeNode {
  tag:      Record<Lang, string>
  question: Record<Lang, string>
  options:  RuntimeOption[]
}

export type RuntimeTree  = Record<string, RuntimeNode>
export type CocktailMap  = Record<string, Cocktail>
import { supabase } from './supabase'
import type { Cocktail, QuizNode, QuizOption } from '@/types'

export async function getCocktails(): Promise<Cocktail[]> {
  const { data, error } = await supabase
    .from('cocktails')
    .select('*')
  if (error) throw error
  return data
}

export async function getQuizTree(): Promise<{ nodes: QuizNode[]; options: QuizOption[] }> {
  const [nodesRes, optionsRes] = await Promise.all([
    supabase.from('quiz_nodes').select('*').order('order_index'),
    supabase.from('quiz_options').select('*').order('order_index'),
  ])
  if (nodesRes.error) throw nodesRes.error
  if (optionsRes.error) throw optionsRes.error
  return { nodes: nodesRes.data, options: optionsRes.data }
}
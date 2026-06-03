import type { WordMatrix } from '@/types'

export const ORIGINAL_MATRIX = {
  column1: [
    'integrated', 'total', 'systemised', 'parallel', 'functional',
    'responsive', 'optional', 'synchronised', 'compatible', 'balanced',
  ] as const,
  column2: [
    'management', 'organisational', 'monitored', 'reciprocal', 'digital',
    'logistical', 'transitional', 'incremental', 'third generation', 'policy',
  ] as const,
  column3: [
    'options', 'flexibility', 'capability', 'mobility', 'programming',
    'concept', 'time-phase', 'projection', 'hardware', 'contingency',
  ] as const,
} satisfies WordMatrix

export const MODERN_MATRIX = {
  column1: [
    'hyper-scale', 'decentralised', 'generative', 'cross-functional', 'agile',
    'sustainable', 'cognitive', 'proactive', 'leveraged', 'deep-dive',
  ] as const,
  column2: [
    'algorithmic', 'friction-free', 'multi-channel', 'cloud-native', 'composable',
    'telemetry', 'omni-directional', 'zero-trust', 'tokenised', 'asynchronous',
  ] as const,
  column3: [
    'paradigm', 'ecosystem', 'touchpoint', 'synergy', 'bandwidth',
    'optimisation', 'pipeline', 'alignment', 'standard', 'vector',
  ] as const,
} satisfies WordMatrix

export const CHAOS_MATRIX: WordMatrix = {
  column1: [...ORIGINAL_MATRIX.column1, ...MODERN_MATRIX.column1],
  column2: [...ORIGINAL_MATRIX.column2, ...MODERN_MATRIX.column2],
  column3: [...ORIGINAL_MATRIX.column3, ...MODERN_MATRIX.column3],
}

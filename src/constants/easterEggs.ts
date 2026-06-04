import type { Mode } from '@/types'

export const EASTER_EGGS: Record<Mode, Record<string, readonly [string, string, string]>> = {
  original: {
    // A nod to Philip Broughton's 1968 satirical intent — the whole game is bafflegab
    '000': ['quintessential', 'managerial', 'bafflegab'],
  },
  modern: {
    // Contemporary consulting-speak at its finest
    '000': ['disruptive', 'stakeholder-centric', 'ideation'],
  },
  chaos: {
    // Self-referential acknowledgement of the chaos mode's purpose
    '000': ['pure', 'unadulterated', 'nonsense'],
  },
}

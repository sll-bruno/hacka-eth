import { create } from 'zustand'

type TradeModalState = {
  isOpen: boolean
  marketTitle?: string
  selectedOutcome?: string
  marketSlug?: string
  tokenId?: string
  lastPrice?: number
  open: (args: { title: string; outcome: string; slug?: string; tokenId?: string; lastPrice?: number }) => void
  close: () => void
}

export const useTradeStore = create<TradeModalState>((set) => ({
  isOpen: false,
  marketTitle: undefined,
  selectedOutcome: undefined,
  marketSlug: undefined,
  tokenId: undefined,
  lastPrice: undefined,
  open: ({ title, outcome, slug, tokenId, lastPrice }) => set({ isOpen: true, marketTitle: title, selectedOutcome: outcome, marketSlug: slug, tokenId, lastPrice }),
  close: () => set({ isOpen: false, marketTitle: undefined, selectedOutcome: undefined, marketSlug: undefined, tokenId: undefined, lastPrice: undefined }),
}))


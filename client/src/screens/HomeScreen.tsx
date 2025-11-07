import { AppShell } from '../components/layout/AppShell'
import { useMarkets } from '../hooks/useMarkets'
import { SwipeDeck } from '../components/swipe/SwipeDeck'
import { BidModal } from '../components/trade/BidModal'
import { SkeletonCard } from '../components/market/SkeletonCard'

export function HomeScreen() {
  const { data, isLoading, isError } = useMarkets()
  const markets = data ?? []

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-6">
        {isLoading && (
          <div className="mt-6">
            <SkeletonCard />
          </div>
        )}
        {isError && (
          <div className="mt-16 text-center text-red-400">Failed to load markets.</div>
        )}
        {!isLoading && !isError && markets.length > 0 && <SwipeDeck items={markets} />}
        <div className="mt-4 text-center text-xs text-white/40">
          Swipe ➡️ para YES · ⬅️ para NO · ⬆️ para pular
        </div>
      </div>
      <BidModal />
    </AppShell>
  )
}



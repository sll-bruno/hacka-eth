import type { PolymarketMarket } from '../../types/polymarket'
import { MarketCard } from '../market/MarketCard'
import { useTradeStore } from '../../state/tradeStore'

type Props = {
  items: PolymarketMarket[]
}

export function VerticalFeed({ items }: Props) {
  const { open } = useTradeStore()

  return (
    <div className="flex-1 overflow-y-auto snap-y snap-mandatory">
      {items.map((m) => {
        const tok = m.tokens?.[0]
        return (
          <section key={m.question + (tok?.token_id || '')} className="snap-start flex items-center justify-center min-h-[80vh] px-1">
            <div className="w-full max-w-[420px]">
              <MarketCard market={m} />
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() =>
                    open({
                      title: m.question,
                      outcome: tok?.outcome || 'Yes',
                      slug: m.market_slug,
                      tokenId: tok?.token_id,
                      lastPrice: tok?.price,
                    })
                  }
                  className="flex-1 rounded-lg bg-accent text-black font-semibold px-3 py-2 drop-shadow-glow"
                >
                  Bid
                </button>
                <a
                  href={m.market_slug ? `https://polymarket.com/market/${m.market_slug}` : `https://polymarket.com/search?q=${encodeURIComponent(m.question)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center rounded-lg border border-card-border px-3 py-2 hover:bg-white/5"
                >
                  Open ↗
                </a>
              </div>
            </div>
          </section>
        )
      })}
      <div className="h-10" />
    </div>
  )
}


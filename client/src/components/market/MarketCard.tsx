import type { PolymarketMarket } from '../../types/polymarket'

type Props = {
  market: PolymarketMarket
}

export function MarketCard({ market }: Props) {
  const cover = market.image || market.icon
  const outcomes = market.tokens?.slice(0, 2) ?? []
  return (
    <div className="relative w-full aspect-[3/4] select-none rounded-2xl border border-card-border bg-surface overflow-hidden">
      {cover ? <img src={cover} alt="cover" className="absolute inset-0 h-full w-full object-cover opacity-40" /> : null}
      <div className="absolute inset-0 p-4 flex flex-col gap-4">
        <div className="mt-auto">
          <h3 className="font-display text-lg leading-snug">
            {market.question}
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {outcomes.map((t) => (
              <div key={t.token_id} className="rounded-lg bg-black/30 px-3 py-2 border border-white/10">
                <p className="text-[11px] text-white/60">{t.outcome}</p>
                <p className="text-base font-semibold">{(t.price * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


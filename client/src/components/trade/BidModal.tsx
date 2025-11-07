import { useState } from 'react'
import { useTradeStore } from '../../state/tradeStore'
import { createOrder } from '../../lib/tradeApi'

export function BidModal() {
  const { isOpen, marketTitle, selectedOutcome, marketSlug, tokenId, lastPrice, close } = useTradeStore()
  const [amount, setAmount] = useState('10')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-surface border border-card-border p-5">
        <h4 className="font-display text-xl">Place Bid</h4>
        <p className="mt-1 text-sm text-white/70 line-clamp-2">{marketTitle}</p>
        <div className="mt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/60">Outcome</span>
            <span className="font-medium">{selectedOutcome}</span>
          </div>
          <div className="mt-3">
            <label className="text-white/60 text-sm">Amount (USDC)</label>
            <input
              className="mt-1 w-full rounded-lg bg-black/30 border border-card-border px-3 py-2 outline-none focus:border-accent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-white/60">Limit price</span>
            <span className="font-medium">{lastPrice ? (lastPrice * 100).toFixed(1) + '%' : '—'}</span>
          </div>
        </div>
        {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button onClick={close} className="flex-1 rounded-lg border border-card-border px-3 py-2">
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={async () => {
              setError(null)
              if (!tokenId) {
                setError('Missing tokenId for outcome')
                return
              }
              const size = Number(amount)
              if (!Number.isFinite(size) || size <= 0) {
                setError('Invalid amount')
                return
              }
              try {
                setSubmitting(true)
                await createOrder({ tokenId, side: 'buy', price: lastPrice ?? 0.5, size, tif: 'GTC' })
                alert('Order submitted')
                close()
              } catch (e: any) {
                setError(e?.response?.data?.error || 'Failed to submit order')
              } finally {
                setSubmitting(false)
              }
            }}
            className="flex-1 rounded-lg bg-accent text-black font-semibold px-3 py-2 drop-shadow-glow disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Confirm'}
          </button>
          <a
            href={marketSlug ? `https://polymarket.com/market/${marketSlug}` : `https://polymarket.com/search?q=${encodeURIComponent(marketTitle ?? '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center rounded-lg border border-card-border px-3 py-2 hover:bg-white/5"
          >
            Trade on Polymarket ↗
          </a>
        </div>
      </div>
    </div>
  )
}


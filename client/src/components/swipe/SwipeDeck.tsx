import { useEffect, useMemo, useState } from 'react'
import { useSprings, animated, to } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'
import type { PolymarketMarket } from '../../types/polymarket'
import { MarketCard } from '../market/MarketCard'
import { useTradeStore } from '../../state/tradeStore'

const toStyle = (i: number) => ({ x: 0, y: i * -4, scale: 1, rot: -1 + Math.random() * 2, delay: i * 60 })
const fromStyle = () => ({ x: 0, rot: 0, scale: 0.95, y: 40, opacity: 0 }) as any

type Props = {
  items: PolymarketMarket[]
}

export function SwipeDeck({ items }: Props) {
  const [gone] = useState(() => new Set<number>())
  const [index, setIndex] = useState(0)
  const { open } = useTradeStore()

  const deck = useMemo(() => items.slice(index, index + 3), [items, index])
  const [springs, api] = useSprings(deck.length, (i) => ({ ...toStyle(i), from: fromStyle() }))

  useEffect(() => {
    gone.clear()
    api.start((i) => ({ ...toStyle(i), from: fromStyle() }))
  }, [deck.length, index, api, gone])

  const bind = useGesture(
    {
      onDrag: ({ args: [cardIndex], active, movement: [mx], direction: [dx], velocity: [vx] }) => {
        const trigger = Math.abs(mx) > 120 || Math.abs(vx) > 0.4
        const dirX = dx < 0 ? -1 : 1

        api.start((i) => {
          if (cardIndex !== i) return
          const isGone = gone.has(i)
          const x = isGone ? (window.innerWidth + 200) * dirX : active ? mx : 0
          const rot = mx / 25
          const scale = active ? 1.02 : 1
          return { x, y: i * -4, rot, scale, opacity: isGone ? 0 : 1, config: { friction: 45, tension: active ? 600 : 400 } }
        })

        if (!active && trigger) {
          gone.add(cardIndex)
          const card = deck[cardIndex]
          if (dirX > 0) {
            const tok = card.tokens?.[0]
            open({
              title: card.question,
              outcome: tok?.outcome || 'Yes',
              slug: card.market_slug,
              tokenId: tok?.token_id,
              lastPrice: tok?.price,
            })
          }

          setTimeout(() => {
            api.start((i) =>
              gone.has(i)
                ? { x: (window.innerWidth + 200) * dirX, opacity: 0 }
                : { x: 0, rot: 0, scale: 1 }
            )
            if (cardIndex === 0) setIndex((v) => v + 1)
          }, 150)
        }

        if (!active && !trigger) {
          api.start((i) => (cardIndex === i ? { x: 0, rot: 0, scale: 1 } : {}))
        }
      },
    },
    { drag: { filterTaps: true, axis: 'x' } }
  )

  return (
    <div className="relative h-[75vh] w-full overflow-hidden">
      {springs.map(({ x, y, rot, scale }, i) => (
        <animated.div key={i} className="absolute inset-0 flex items-center justify-center" style={{ x, y }}>
          <animated.div
            {...bind(i)}
            className="w-full will-change-transform"
            style={{ transform: to([rot, scale], (r, s) => `perspective(1600px) rotateZ(${r}deg) scale(${s})`) }}
          >
            <MarketCard market={deck[i]} />
          </animated.div>
        </animated.div>
      ))}
    </div>
  )
}


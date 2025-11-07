import { useCallback, useEffect, useMemo, useState } from 'react'
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

  const baseY = useCallback((i: number) => i * -4, [])

  const pickOutcomeToken = (tokens: PolymarketMarket['tokens'] = [], desired: 'yes' | 'no') => {
    const normalizedDesired = desired === 'yes' ? 'yes' : 'no'
    const normalizeOutcome = (value?: string) => value?.trim().toLowerCase() ?? ''
    const match = tokens.find((t) => normalizeOutcome(t.outcome).startsWith(normalizedDesired))
    if (match) return match
    if (desired === 'yes') return tokens[0] || null
    return tokens[1] || tokens[0] || null
  }

  const deck = useMemo(() => items.slice(index, index + 3), [items, index])
  const [springs, api] = useSprings(deck.length, (i: number) => ({ ...toStyle(i), from: fromStyle() }))

  useEffect(() => {
    gone.clear()
    api.start((i: number) => ({ ...toStyle(i), from: fromStyle() }))
  }, [deck.length, index, api, gone])

  const performAction = useCallback(
    (cardIndex: number, globalIndex: number, action: 'yes' | 'no' | 'next') => {
      if (cardIndex !== 0) return

      const card = items[globalIndex]
      if (!card) return

      if (action === 'yes' || action === 'no') {
        const tok = pickOutcomeToken(card.tokens, action)
        open({
          title: card.question,
          outcome: tok?.outcome || (action === 'yes' ? 'Yes' : 'No'),
          slug: card.market_slug,
          tokenId: tok?.token_id,
          lastPrice: tok?.price,
        })

        gone.delete(cardIndex)
        api.start((i: number) =>
          i === cardIndex ? { x: 0, y: baseY(i), rot: 0, scale: 1, opacity: 1, config: { friction: 45, tension: 400 } } : undefined
        )

        return
      }

      const exitYUp = -(window.innerHeight + 200)

      gone.add(cardIndex)

      api.start((i: number) => {
        if (cardIndex !== i) return undefined
        return { x: 0, y: exitYUp, rot: 0, scale: 1, opacity: 0, config: { friction: 45, tension: 400 } }
      })

      setTimeout(() => {
        api.start((i: number) =>
          gone.has(i)
            ? { x: 0, y: exitYUp, rot: 0, scale: 1, opacity: 0 }
            : { x: 0, y: baseY(i), rot: 0, scale: 1, opacity: 1 }
        )
        setIndex((v: number) => Math.max(v, globalIndex) + 1)
      }, 150)
    },
    [api, baseY, gone, items, open]
  )

  const bind = useGesture(
    {
      onDrag: (state: any) => {
        const { args, active, movement, direction, velocity } = state
        const [cardIndex] = (args ?? [0]) as [number]
        const [mx, my] = (movement ?? [0, 0]) as [number, number]
        const [dx, dy] = (direction ?? [0, 0]) as [number, number]
        const [vx, vy] = (velocity ?? [0, 0]) as [number, number]

        const isVertical = Math.abs(my) > Math.abs(mx)
        const isHorizontal = !isVertical
        const horizontalTrigger = Math.abs(mx) > 120 || Math.abs(vx) > 0.4
        const verticalTrigger = Math.abs(my) > 120 || Math.abs(vy) > 0.4
        const dirX = dx < 0 ? -1 : 1
        const exitX = (window.innerWidth + 200) * dirX
        const exitYUp = -(window.innerHeight + 200)

        api.start((i: number) => {
          if (cardIndex !== i) return
          const isGone = gone.has(i)
          const scale = active ? 1.02 : 1

          if (isHorizontal) {
            const rot = mx / 25
            const x = isGone ? exitX : active ? mx : 0
            return { x, y: baseY(i), rot, scale, opacity: isGone ? 0 : 1, config: { friction: 45, tension: active ? 600 : 400 } }
          }

          const y = isGone ? exitYUp : baseY(i) + (active ? my : 0)
          return { x: 0, y, rot: 0, scale, opacity: isGone ? 0 : 1, config: { friction: 45, tension: active ? 600 : 400 } }
        })

        const shouldOpenYes = !active && cardIndex === 0 && isHorizontal && horizontalTrigger && dirX > 0
        const shouldOpenNo = !active && cardIndex === 0 && isHorizontal && horizontalTrigger && dirX < 0
        const shouldShowNew = !active && cardIndex === 0 && isVertical && dy < 0 && verticalTrigger

        if (shouldOpenYes || shouldOpenNo || shouldShowNew) {
          const globalIndex = index + cardIndex
          performAction(cardIndex, globalIndex, shouldShowNew ? 'next' : dirX > 0 ? 'yes' : 'no')
          return
        }

        const shouldReset = !active && !shouldOpenYes && !shouldOpenNo && !shouldShowNew

        if (shouldReset) {
          api.start((i: number) => (cardIndex === i ? { x: 0, y: baseY(i), rot: 0, scale: 1, opacity: 1 } : {}))
        }
      },
    },
    { drag: { filterTaps: true } }
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (deck.length === 0) return

      const topIndex = 0
      const globalIndex = index

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault()
          performAction(topIndex, globalIndex, 'yes')
          break
        case 'ArrowLeft':
          event.preventDefault()
          performAction(topIndex, globalIndex, 'no')
          break
        case 'ArrowUp':
          event.preventDefault()
          performAction(topIndex, globalIndex, 'next')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [deck, index, performAction])

  return (
    <div className="relative h-[75vh] w-full overflow-hidden">
      {springs.map((spring: any, i: number) => {
        const { x, y, rot, scale } = spring as any
        return (
        <animated.div key={i} className="absolute inset-0 flex items-center justify-center" style={{ x, y }}>
          <animated.div
            {...bind(i)}
            className="w-full will-change-transform"
              style={{ transform: to([rot, scale], (r: number, s: number) => `perspective(1600px) rotateZ(${r}deg) scale(${s})`) }}
          >
            <MarketCard market={deck[i]} />
          </animated.div>
        </animated.div>
        )
      })}
    </div>
  )
}


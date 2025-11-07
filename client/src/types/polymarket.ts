export type PolymarketToken = {
  token_id: string
  outcome: string
  price: number
  winner: boolean
}

export type PolymarketMarket = {
  question: string
  description?: string
  image?: string
  icon?: string
  market_slug?: string
  end_date_iso?: string
  closed: boolean
  active: boolean
  accepting_orders?: boolean
  enable_order_book?: boolean
  tags?: string[]
  tokens: PolymarketToken[]
}

export type MarketsResponse = {
  count: number
  limit: number
  next_cursor?: string
  data: PolymarketMarket[]
}


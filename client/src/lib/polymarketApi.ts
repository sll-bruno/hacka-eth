import axios from 'axios'
import type { PolymarketMarket, PolymarketToken } from '../types/polymarket'

// The base URL is no longer used for the fetchMarkets call, as it now goes through the local proxy.
const BASE_URL = 'https://gamma-api.polymarket.com'

export async function fetchMarkets(limit = 150): Promise<PolymarketMarket[]> {
  // This URL now points to our own backend proxy to bypass CORS issues.
  const url = `/api/markets?limit=${limit}`
  try {
    // The proxy returns a direct array of markets, not a MarketsResponse object.
    const res = await axios.get<any[]>(url)
    const markets = res.data ?? []

    // Data transformation: The new API returns outcomes/prices differently.
    // We need to transform it back into the shape the UI expects (with a `tokens` array).
    return markets
      .map((market) => {
      const outcomeNames: string[] = JSON.parse(market.outcomes || '[]')
      const outcomePrices: string[] = JSON.parse(market.outcomePrices || '[]')
      const tokenIds: string[] = JSON.parse(market.clobTokenIds || '[]')

        const tokens: PolymarketToken[] = outcomeNames.map((name, i) => ({
          outcome: name,
          price: parseFloat(outcomePrices[i]),
          token_id: tokenIds[i] || `${market.id}-${i}`,
          winner: false, // Not provided by this API, default to false
        }))

        const sanitizedTokens = tokens.filter((token) => Number.isFinite(token.price))

        return { ...market, tokens: sanitizedTokens }
      })
      .filter((market) => (market.tokens?.length ?? 0) >= 2)
  } catch (error) {
    console.error('Failed to fetch markets from proxy:', error)
    throw error
  }
}


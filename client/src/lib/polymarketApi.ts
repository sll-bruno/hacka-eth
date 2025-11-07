import axios from 'axios'
import type { PolymarketMarket } from '../types/polymarket'

// The base URL is no longer used for the fetchMarkets call, as it now goes through the local proxy.
const BASE_URL = 'https://gamma-api.polymarket.com'

export async function fetchMarkets(limit = 150): Promise<PolymarketMarket[]> {
  // This URL now points to our own backend proxy to bypass CORS issues.
  const url = `/api/markets?limit=${limit}`
  try {
    // The proxy returns a direct array of markets, not a MarketsResponse object.
    const res = await axios.get<PolymarketMarket[]>(url)
    return res.data ?? [] // res.data is the array itself.
  } catch (error) {
    console.error('Failed to fetch markets from proxy:', error)
    throw error
  }
}


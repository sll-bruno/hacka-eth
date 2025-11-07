import axios from 'axios'
import type { MarketsResponse, PolymarketMarket } from '../types/polymarket'

const BASE_URL = 'https://clob.polymarket.com'

export async function fetchMarkets(limit = 100): Promise<PolymarketMarket[]> {
  const url = `${BASE_URL}/markets?limit=${limit}`
  const res = await axios.get<MarketsResponse>(url)
  const all = res.data?.data ?? []
  // Basic client-side filter for open/interesting markets
  return all.filter((m) => m.closed === false)
}


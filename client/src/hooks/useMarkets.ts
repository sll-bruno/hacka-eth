import { useQuery } from '@tanstack/react-query'
import { fetchMarkets } from '../lib/polymarketApi'

export function useMarkets() {
  return useQuery({
    queryKey: ['polymarket', 'markets'],
    queryFn: () => fetchMarkets(150),
    staleTime: 60_000,
  })
}


import axios from 'axios'

export type CreateOrderParams = {
  tokenId: string
  side: 'buy' | 'sell'
  price: number
  size: number
  tif?: 'GTC' | 'IOC' | 'FOK'
}

export async function createOrder(params: CreateOrderParams) {
  const res = await axios.post('/api/order', params)
  return res.data
}


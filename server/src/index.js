import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { ClobClient } from '@polymarket/clob-client'
import { Chain, Side, OrderType } from '@polymarket/clob-client/dist/types.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// Initialize Polymarket client if keys exist
const hasKeys = Boolean(process.env.POLYMARKET_API_KEY && process.env.POLYMARKET_API_SECRET && process.env.POLYMARKET_PASSPHRASE)
const clob = hasKeys
  ? new ClobClient(
      'https://clob.polymarket.com',
      Chain.POLYGON,
      undefined,
      {
        key: process.env.POLYMARKET_API_KEY,
        secret: process.env.POLYMARKET_API_SECRET,
        passphrase: process.env.POLYMARKET_PASSPHRASE,
      }
    )
  : null

// Minimal create order route
app.post('/api/order', async (req, res) => {
  try {
    if (!clob) return res.status(501).json({ error: 'Trading not enabled. Missing API keys on server.' })
    const { tokenId, side, price, size, tif } = req.body || {}
    if (!tokenId || !side || typeof price !== 'number' || typeof size !== 'number') {
      return res.status(400).json({ error: 'tokenId, side, price, size are required' })
    }
    const orderSide = String(side).toLowerCase() === 'sell' ? Side.SELL : Side.BUY
    const order = await clob.createAndPostOrder(
      {
        tokenID: tokenId,
        price,
        size,
        side: orderSide,
      },
      {},
      OrderType.GTC
    )
    return res.json({ ok: true, order })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('order error', err)
    return res.status(500).json({ error: 'Failed to place order', details: String(err?.message || err) })
  }
})


const port = process.env.PORT || 8787
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on :${port}`)
})


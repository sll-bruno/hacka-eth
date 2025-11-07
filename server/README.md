# Server (minimal)

## Setup

```bash
cd server
npm install
cp .env.example .env # defina suas chaves quando disponíveis
npm run dev
```

Endpoints:
- `GET /health` → `{ ok: true }`
- `POST /api/order` → 501 até habilitarmos trading real



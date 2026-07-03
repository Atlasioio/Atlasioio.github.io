import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev-only mirror of the Vercel `/api/chat` serverless function, so the project
 * assistant works with `npm run dev` too (Vite's dev server doesn't run the
 * `api/` functions). Needs ANTHROPIC_API_KEY in a local `.env`. In production the
 * real function in `api/chat.js` handles this instead.
 */
function chatApiDev(key?: string): Plugin {
  return {
    name: 'chat-api-dev',
    apply: 'serve',
    configureServer(server) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      server.middlewares.use('/api/chat', async (req: any, res: any) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(body))
        }
        if (req.method !== 'POST') return send(405, { error: 'Method not allowed' })
        if (!key) return send(503, { error: "The assistant isn't set up yet." })
        try {
          let raw = ''
          for await (const chunk of req) raw += chunk
          const { messages, system } = JSON.parse(raw || '{}')
          if (!Array.isArray(messages) || messages.length === 0) {
            return send(400, { error: 'No messages provided.' })
          }
          const trimmed = messages
            .slice(-12)
            .filter((m: { content?: unknown }) => m && typeof m.content === 'string' && m.content.trim())
            .map((m: { role?: string; content: string }) => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content.slice(0, 2000),
            }))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const r = await (globalThis as any).fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
            body: JSON.stringify({
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 700,
              system: typeof system === 'string' ? system.slice(0, 16000) : undefined,
              messages: trimmed,
            }),
          })
          if (!r.ok) return send(502, { error: 'The assistant is unavailable right now.' })
          const data = await r.json()
          const reply = (data.content || [])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((b: any) => b.type === 'text')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((b: any) => b.text)
            .join('\n')
            .trim()
          return send(200, { reply: reply || '…' })
        } catch {
          return send(500, { error: 'Something went wrong.' })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react(), chatApiDev(env.ANTHROPIC_API_KEY)],
  }
})

// Vercel serverless function — proxies the project chatbot to the Anthropic
// (Claude) API so the API key never touches the client. Set ANTHROPIC_API_KEY
// in the Vercel project's Environment Variables (server-side; never VITE_*).
//
// The client sends the conversation plus a `system` prompt built from the
// portfolio's own project data, so Claude only answers from what's on the site.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    res.status(503).json({ error: "The assistant isn't set up yet." })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { messages, system } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'No messages provided.' })
      return
    }

    // Keep the last dozen turns, cap each message, and normalise roles.
    const trimmed = messages
      .slice(-12)
      .filter((m) => m && typeof m.content === 'string' && m.content.trim())
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content.slice(0, 2000),
      }))

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 700,
        system: typeof system === 'string' ? system.slice(0, 16000) : undefined,
        messages: trimmed,
      }),
    })

    if (!r.ok) {
      res.status(502).json({ error: 'The assistant is unavailable right now.' })
      return
    }

    const data = await r.json()
    const reply = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()

    res.status(200).json({ reply: reply || '…' })
  } catch {
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

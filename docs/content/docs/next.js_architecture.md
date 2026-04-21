---
title: Next.js Architecture
description: Next.js Architecture Documentation
---

### [ React Component (frontend) ]

```ts
await fetch('/api/horoscope', {
  method: 'POST',
  body: JSON.stringify({ sign: 'Leo' })
});
```
### ↓

### fetch('/api/horoscope')

### ↓

### [ API Route (server-only) ]
```
app/api/horoscope/route.ts
```

```
import { generateHoroscope } from '@/lib/geminiService';

export async function POST(req: Request) {
  const { sign } = await req.json();

  const result = await generateHoroscope(sign);

  return Response.json({ result });
}
```

### ↓

### [ geminiService.ts (server-only) ]
```
lib/geminiService.ts   ← IMPORTANT: not inside /app (safer convention)
```

```
export async function generateHoroscope(sign: string) {
  const key = process.env.OPENAI_API_KEY;

  // call OpenAI / Gemini here
}
```

### ↓

### [ OpenAI / Gemini API ]
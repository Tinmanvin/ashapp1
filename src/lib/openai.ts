import OpenAI from 'openai'
import { PLATFORM_RULES, Platform } from './captionPrompts'

// Lazy-init so a missing key doesn't crash the bundle at module load time
let _client: OpenAI | null = null
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
      dangerouslyAllowBrowser: true,
    })
  }
  return _client
}

export async function generateCaption(
  assetName: string,
  assetType: string,
  platform: Platform
): Promise<string> {
  const { systemPrompt } = PLATFORM_RULES[platform]

  const response = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Write a caption for: "${assetName}" (type: ${assetType})` },
    ],
    max_tokens: 300,
    temperature: 0.85,
  })

  return response.choices[0].message.content?.trim() ?? ''
}

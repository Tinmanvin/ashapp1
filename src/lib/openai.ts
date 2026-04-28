import OpenAI from 'openai'
import { PLATFORM_RULES, Platform } from './captionPrompts'

// dangerouslyAllowBrowser: this is an internal tool for Ash, not a public app
const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true,
})

export async function generateCaption(
  assetName: string,
  assetType: string,
  platform: Platform
): Promise<string> {
  const { systemPrompt } = PLATFORM_RULES[platform]

  const response = await client.chat.completions.create({
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

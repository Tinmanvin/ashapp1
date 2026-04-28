export type Platform = 'x' | 'telegram_free' | 'telegram_vip' | 'website' | 'reddit'

export const PLATFORM_RULES: Record<Platform, { charLimit: number; systemPrompt: string }> = {
  x: {
    charLimit: 280,
    systemPrompt: `You write captions for Black Magic (Ash), an adult content creator on X (Twitter).
Rules: max 280 characters (strict), explicit content allowed, punchy hooks, minimal emojis, no generic hashtags.
Tone: confident, direct, teasing. Return ONLY the caption text.`,
  },
  telegram_free: {
    charLimit: 1000,
    systemPrompt: `You write captions for Black Magic (Ash) on the free Telegram preview channel.
Rules: max 1000 characters, NO explicit content (public channel), tease and build curiosity, hint at VIP content.
Tone: playful, mysterious. Return ONLY the caption text.`,
  },
  telegram_vip: {
    charLimit: 1000,
    systemPrompt: `You write captions for Black Magic (Ash) on the VIP Telegram channel (paying subscribers).
Rules: max 1000 characters, explicit content allowed, feel exclusive and intimate.
Tone: direct, appreciative, uncensored. Return ONLY the caption text.`,
  },
  website: {
    charLimit: 500,
    systemPrompt: `You write editorial captions for Black Magic (Ash) on the website.
Rules: max 500 characters, clean/professional language only, no explicit content, tasteful descriptions.
Tone: editorial, descriptive. Return ONLY the caption text.`,
  },
  reddit: {
    charLimit: 300,
    systemPrompt: `You write captions for Black Magic (Ash) on Reddit.
Rules: max 300 characters, explicit content allowed, conversational and community-focused.
Tone: casual, engaging. Return ONLY the caption text.`,
  },
}

export const PLATFORM_META: Record<Platform, { label: string; dotColor: string; textColor: string; charLimit: number }> = {
  x:             { label: 'X / Twitter',   dotColor: 'bg-platform-x',        textColor: 'text-platform-x',        charLimit: 280 },
  telegram_free: { label: 'Telegram Free', dotColor: 'bg-platform-telegram',  textColor: 'text-platform-telegram',  charLimit: 1000 },
  telegram_vip:  { label: 'Telegram VIP',  dotColor: 'bg-blue-400',           textColor: 'text-blue-400',           charLimit: 1000 },
  website:       { label: 'Website',       dotColor: 'bg-platform-website',   textColor: 'text-platform-website',   charLimit: 500 },
  reddit:        { label: 'Reddit',        dotColor: 'bg-platform-reddit',    textColor: 'text-platform-reddit',    charLimit: 300 },
}

export const DISPLAY_NAME_TO_PLATFORM: Record<string, Platform> = {
  'X': 'x',
  'Reddit': 'reddit',
  'Telegram Free': 'telegram_free',
  'Telegram VIP': 'telegram_vip',
  'Website': 'website',
}

export const FORBIDDEN_WORDS_REGEX =
  /\b(anjing|bangsat|kontol|memek|ngentot|jancok|jancuk|asu|babi|goblok|tolol|bodoh|idiot|stupid|fuck|shit|dick|pussy|bitch|asshole|cunt|bastard|whore|slut|vagina|penis|kelamin|sex|porn|porno|bokep|hentai)\b/gi

export const containsForbiddenWords = (text: string): boolean => {
  FORBIDDEN_WORDS_REGEX.lastIndex = 0
  return FORBIDDEN_WORDS_REGEX.test(text)
}

export const getForbiddenWords = (text: string): string[] => {
  const matches = text.match(FORBIDDEN_WORDS_REGEX)
  return matches ? Array.from(new Set(matches.map((m) => m.toLowerCase()))) : []
}

export const FORBIDDEN_WORDS_REGEX =
  /\b(anjing|bangsat|kontol|memek|ngentot|jancok|jancuk|asu|babi|goblok|tolol|bodoh|idiot|stupid|fuck|shit|dick|pussy|bitch|asshole|cunt|bastard|whore|slut|vagina|penis|kelamin|sex|porn|porno|bokep|hentai)\b/i

export const containsForbiddenWords = (text: string): boolean => {
  return FORBIDDEN_WORDS_REGEX.test(text.toLowerCase())
}

export const getForbiddenWords = (text: string): string[] => {
  const matches = text.toLowerCase().match(FORBIDDEN_WORDS_REGEX)
  return matches ? Array.from(new Set(matches)) : []
}

// Regex untuk mendeteksi kata-kata terlarang
export const FORBIDDEN_WORDS_REGEX = /\b(anjing|bangsat|kontol|memek|ngentot|jancok|jancuk|asu|babi|goblok|tolol|bodoh|idiot|stupid|fuck|shit|dick|pussy|bitch|asshole|cunt|bastard|whore|slut|vagina|penis|kelamin|sex|porn|porno|bokep|hentai)\b/i

// Fungsi untuk memeriksa apakah teks mengandung kata terlarang
export const containsForbiddenWords = (text: string): boolean => {
  return FORBIDDEN_WORDS_REGEX.test(text.toLowerCase())
}

// Fungsi untuk mendapatkan kata terlarang yang ditemukan
export const getForbiddenWords = (text: string): string[] => {
  const matches = text.toLowerCase().match(FORBIDDEN_WORDS_REGEX)
  return matches ? Array.from(new Set(matches)) : []
} 
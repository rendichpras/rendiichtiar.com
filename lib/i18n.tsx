"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import id from "@/messages/id.json"
import en from "@/messages/en.json"

type Language = "id" | "en"
export type Messages = typeof id

interface I18nContextType {
  language: Language
  messages: Messages
  setLanguage: (lang: Language) => void
}

const messages = { id, en }

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("id")

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }, [])

  return (
    <I18nContext.Provider
      value={{
        language,
        messages: messages[language],
        setLanguage: handleSetLanguage,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
} 
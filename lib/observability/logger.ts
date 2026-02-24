type LogMeta = Record<string, unknown>

function getCircularReplacer() {
  const seen = new WeakSet()
  return (key: string, value: unknown) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]"
      }
      seen.add(value)
    }
    return value
  }
}

function safeSerialize(meta?: LogMeta): string {
  if (!meta) return ""
  try {
    return ` ${JSON.stringify(meta, getCircularReplacer())}`
  } catch {
    return " [Log Serialization Failed]"
  }
}

function prefix(level: string) {
  return `[${level}]`
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV === "production") return
    console.info(`${prefix("info")} ${message}${safeSerialize(meta)}`)
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(`${prefix("warn")} ${message}${safeSerialize(meta)}`)
  },
  error(message: string, meta?: LogMeta) {
    console.error(`${prefix("error")} ${message}${safeSerialize(meta)}`)
  },
}

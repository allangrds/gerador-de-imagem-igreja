const BASE_NAME = 'gerador_imagem_igreja_'

export function getStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${BASE_NAME}${key}`)

    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

export function setStoredJson(key: string, value: unknown) {
  try {
    localStorage.setItem(`${BASE_NAME}${key}`, JSON.stringify(value))
  } catch {
    // Storage may be full or blocked (private mode); the editor keeps working without it.
  }
}

"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

const THEME_STORAGE_KEY = "theme"
const THEME_CHANGE_EVENT = "theme-change"

const ThemeContext = React.createContext<{
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
} | null>(null)

function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored
    }
  } catch {
    // ignore
  }

  return "system"
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener(THEME_CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(THEME_CHANGE_EVENT, callback)
  }
}

function getThemeSnapshot() {
  return getStoredTheme()
}

function getThemeServerSnapshot(): Theme {
  return "system"
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function subscribeSystem(callback: () => void) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)")
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function getSystemSnapshot(): ResolvedTheme {
  return getSystemTheme()
}

function getSystemServerSnapshot(): ResolvedTheme {
  return "light"
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  )
  const systemTheme = React.useSyncExternalStore(
    subscribeSystem,
    getSystemSnapshot,
    getSystemServerSnapshot
  )

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme

  React.useEffect(() => {
    const el = document.documentElement
    el.classList.toggle("dark", resolvedTheme === "dark")
    el.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const setTheme = React.useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }, [])

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider, useTheme }
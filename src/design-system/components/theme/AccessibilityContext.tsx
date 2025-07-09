import { createContext } from 'react'

interface AccessibilityContextType {
  announceToScreenReader: (message: string) => void
  focusElement: (element: HTMLElement | null) => void
  trapFocus: (container: HTMLElement) => void
  releaseFocus: () => void
}


export type { AccessibilityContextType } 
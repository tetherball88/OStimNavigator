import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import * as jsonContribution from 'monaco-editor/esm/vs/language/json/monaco.contribution.js'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker&inline'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker&inline'
import { loader } from '@monaco-editor/react'

// Ultralight lacks navigator.clipboard; Monaco's BrowserClipboardService attaches
// click/keydown listeners that call navigator.clipboard.write([new ClipboardItem(...)]).
function installClipboardPolyfill() {
  if (!navigator.clipboard) {
    const noopWrite = async (items?: unknown[]) => {
      if (Array.isArray(items)) {
        for (const item of items) {
          const clipItem = item as { types?: string[]; getType?: (t: string) => unknown } | null
          if (clipItem && Array.isArray(clipItem.types) && typeof clipItem.getType === 'function') {
            for (const type of clipItem.types) {
              Promise.resolve(clipItem.getType(type)).catch(() => {})
            }
          }
        }
      }
    }
    try {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          write: noopWrite,
          writeText: async () => {},
          read: async () => [],
          readText: async () => '',
        },
      })
    } catch {
      // Ignore if navigator.clipboard cannot be defined.
    }
  }

  const g = window as unknown as {
    ClipboardItem?: new (items: Record<string, unknown>, options?: unknown) => object
  }
  if (typeof g.ClipboardItem !== 'function') {
    g.ClipboardItem = class PolyfillClipboardItem {
      readonly types: string[]
      private readonly items: Record<string, unknown>

      constructor(items: Record<string, unknown>) {
        this.items = items ?? {}
        this.types = Object.keys(this.items)
        for (const key of this.types) {
          const val = this.items[key]
          if (val && typeof (val as PromiseLike<unknown>).then === 'function') {
            Promise.resolve(val).catch(() => {})
          }
        }
      }

      async getType(type: string): Promise<Blob> {
        const raw = await Promise.resolve(this.items[type])
        if (raw instanceof Blob) return raw
        return new Blob([typeof raw === 'string' ? raw : ''], { type })
      }
    }
  } else {
    const NativeClipboardItem = g.ClipboardItem
    g.ClipboardItem = class SafeClipboardItem extends NativeClipboardItem {
      constructor(items: Record<string, unknown>, options?: unknown) {
        if (items) {
          for (const val of Object.values(items)) {
            if (val && typeof (val as PromiseLike<unknown>).then === 'function') {
              Promise.resolve(val).catch(() => {})
            }
          }
        }
        super(items, options)
      }
    }
  }
}

installClipboardPolyfill()

;(monaco.languages as unknown as { json: typeof jsonContribution }).json = jsonContribution

self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    return new editorWorker()
  },
}

loader.config({ monaco })

import type { editor } from 'monaco-editor'
import type * as MonacoType from 'monaco-editor'

export type Monaco = typeof MonacoType

/**
 * Monaco Editor options to prevent Monaco from truncating copied content
 * and inserting Unicode ellipsis ('…', \u2026).
 *
 * Setting `accessibilitySupport: 'on'` tells Monaco that a screen reader is active,
 * which flips Monaco's internal `trimLongText` flag to false.
 * Setting `accessibilityPageSize: 100000` prevents Monaco from paging selections
 * into multi-page chunks connected with '…'.
 */
export const SAFE_MONACO_CLIPBOARD_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
    accessibilitySupport: 'on',
    accessibilityPageSize: 100000,
}

/**
 * When `accessibilitySupport: 'on'` is set (to prevent Monaco from truncating copied text to 500 chars with '…'),
 * Monaco's built-in keybindings for word-based navigation (Ctrl+Left, Ctrl+Right, Ctrl+Shift+Left, Ctrl+Shift+Right)
 * are conditionally disabled on Windows because Monaco assumes screen readers like NVDA manage word jumping.
 *
 * In PrismaUI/CEF, no screen reader is present, so word navigation must be explicitly restored.
 */
export function restoreWordNavigation(ed: editor.IStandaloneCodeEditor, monaco: Monaco) {
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.LeftArrow, () => {
        ed.trigger('keyboard', 'cursorWordLeft', null)
    })
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.RightArrow, () => {
        ed.trigger('keyboard', 'cursorWordEndRight', null)
    })
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.LeftArrow, () => {
        ed.trigger('keyboard', 'cursorWordLeftSelect', null)
    })
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.RightArrow, () => {
        ed.trigger('keyboard', 'cursorWordEndRightSelect', null)
    })
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backspace, () => {
        ed.trigger('keyboard', 'deleteWordLeft', null)
    })
    ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Delete, () => {
        ed.trigger('keyboard', 'deleteWordRight', null)
    })
}

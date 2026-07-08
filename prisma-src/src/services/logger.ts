export function log(message: string): void {
    if (import.meta.env.DEV) {
        console.log('[webUI]', message)
        return
    }
    window.log?.(`info|${message}`)
}

export function warn(message: string): void {
    if (import.meta.env.DEV) {
        console.warn('[webUI]', message)
        return
    }
    window.log?.(`warn|${message}`)
}

export function error(message: string): void {
    if (import.meta.env.DEV) {
        console.error('[webUI]', message)
        return
    }
    window.log?.(`error|${message}`)
}
